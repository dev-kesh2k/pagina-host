#Requires -Version 5.1
<#
.SYNOPSIS
  Configura e faz deploy do Kesh Dashboard para o WSL (Ubuntu) em 1 clique.
  NAO precisa de Cloudflare, ngrok, SSH externo ou chaves publicas.
  Usa wsl.exe nativo do Windows.
#>
[CmdletBinding()]
param(
  [switch]$SetupServer,
  [switch]$Deploy,
  [switch]$OpenBrowser,
  [string]$WslDistro = "Ubuntu"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ProjectRoot = Split-Path -Parent $PSScriptRoot

$WinDrive = ($ProjectRoot.Substring(0,1)).ToLowerInvariant()
$WslPath = $ProjectRoot -replace '\\','/' -replace '^[A-Za-z]:',"/mnt/$WinDrive"
$WslProjectRoot = $WslPath

$DeployPath = "/var/www/pagina-host"

function Write-Step {
  param([string]$Msg)
  Write-Host ""
  Write-Host "▶ $Msg" -ForegroundColor Cyan
}

function Write-Ok {
  param([string]$Msg)
  Write-Host "  ✅ $Msg" -ForegroundColor Green
}

function Write-Warn {
  param([string]$Msg)
  Write-Host "  ⚠️  $Msg" -ForegroundColor Yellow
}

function Write-Fail {
  param([string]$Msg)
  Write-Host "  ❌ $Msg" -ForegroundColor Red
  exit 1
}

function Invoke-Wsl {
  param([string]$BashCmd, [switch]$Sudo)
  $escaped = $BashCmd.Replace("'", "'\''")
  $full = "bash -c '$escaped'"
  if ($Sudo) {
    $output = & wsl.exe -d $WslDistro -u root -- bash -c $full 2>&1 | Out-String
  } else {
    $output = & wsl.exe -d $WslDistro -- bash -c $full 2>&1 | Out-String
  }
  if ($LASTEXITCODE -ne 0) {
    throw "Comando WSL falhou (exit $LASTEXITCODE): $BashCmd`nSaida: $output"
  }
  return $output.Trim()
}

if (-not $SetupServer -and -not $Deploy -and -not $OpenBrowser) {
  Write-Step "Nenhuma flag passada, rodando fluxo COMPLETO (Setup + Build + Deploy + Abrir navegador)"
  $SetupServer = $true
  $Deploy = $true
  $OpenBrowser = $true
}

# =====================================================================
# PASSO 1: SETUP DO SERVIDOR DENTRO DO WSL (Ubuntu)
# =====================================================================
if ($SetupServer) {
  Write-Step "Verificando WSL distro '$WslDistro'..."
  try {
    $distroState = (wsl.exe --list --verbose | Select-String $WslDistro) -join "`n"
    Write-Ok "WSL Ubuntu esta ativo: $distroState"
  } catch {
    Write-Fail "Distro $WslDistro nao encontrada. Rode: wsl --install -d Ubuntu"
  }

  Write-Step "Instalando Nginx, rsync e openssh-server (se necessario)..."
  try {
    Invoke-Wsl -Sudo @"
export DEBIAN_FRONTEND=noninteractive;
apt-get update -qq 2>&1 | tail -5;
apt-get install -y -qq nginx rsync openssh-server 2>&1 | tail -5;
"@
    Write-Ok "Pacotes instalados"
  } catch {
    Write-Warn "Nao foi possivel instalar pacotes (talvez ja tenha?): $_"
  }

  Write-Step "Configurando pasta de deploy: $DeployPath"
  try {
    Invoke-Wsl -Sudo @"
mkdir -p $DeployPath;
chown -R root:www-data $DeployPath;
chmod -R 775 $DeployPath;
"@
    Write-Ok "Pasta criada com permissoes corretas"
  } catch { Write-Fail "Falhou ao criar pasta de deploy: $_" }

  Write-Step "Copiando configuracao do Nginx..."
  try {
    $nginxConfPath = Join-Path $PSScriptRoot "nginx.conf.example"
    Invoke-Wsl -Sudo @"
cp -f '$WslProjectRoot/deploy/nginx.conf.example' /etc/nginx/sites-available/pagina-host;
ln -sf /etc/nginx/sites-available/pagina-host /etc/nginx/sites-enabled/pagina-host;
rm -f /etc/nginx/sites-enabled/default;
"@
    Write-Ok "Nginx configurado (site-padrao desabilitado, pagina-host habilitado)"
  } catch { Write-Fail "Falhou ao configurar Nginx: $_" }

  Write-Step "Ajustando post-deploy permissions para rodar sem senha..."
  try {
    $who = (Invoke-Wsl "whoami").Trim()
    Invoke-Wsl -Sudo @"
if [ ! -f /etc/sudoers.d/deploy-pagina ]; then
  echo '$who ALL=(ALL) NOPASSWD: $WslProjectRoot/deploy/post-deploy.sh' > /etc/sudoers.d/deploy-pagina;
  chmod 440 /etc/sudoers.d/deploy-pagina;
  visudo -cf /etc/sudoers.d/deploy-pagina;
fi;
chmod +x $WslProjectRoot/deploy/post-deploy.sh;
chmod +x $WslProjectRoot/deploy/setup-wsl.sh;
"@
    Write-Ok "Sudoers configurado (usuario WSL: $who)"
  } catch { Write-Warn "Sudoers: $_"}

  Write-Step "Testando e reiniciando Nginx..."
  try {
    Invoke-Wsl -Sudo "nginx -t && systemctl reload nginx 2>/dev/null || (service nginx status >/dev/null 2>&1 && service nginx restart) || service nginx start"
    Write-Ok "Nginx rodando e carregado!"
  } catch { Write-Warn "Nginx test ok, mas restart: $_" }
}

# =====================================================================
# PASSO 2: BUILD NO WINDOWS + DEPLOY PARA O WSL
# =====================================================================
if ($Deploy) {
  Write-Step "Rodando 'npm ci' e 'npm run build' no Windows..."
  Push-Location $ProjectRoot
  try {
    & npm.cmd ci --no-audit --no-fund 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "npm ci falhou" }
    & npm.cmd run build 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "npm run build falhou" }
    Write-Ok "Build concluido (dist/ criada)"
  } catch {
    Pop-Location
    Write-Fail "Build falhou: $_"
  }
  Pop-Location

  Write-Step "Copiando dist/ para $DeployPath no WSL..."
  try {
    Invoke-Wsl -Sudo @"
set -e;
shopt -s dotglob nullglob;
rm -rf ${DeployPath:?}/*;
cp -r $WslProjectRoot/dist/* $DeployPath/;
chown -R root:www-data $DeployPath;
chmod -R 775 $DeployPath;
"@
    Write-Ok "Arquivos copiados!"
  } catch { Write-Fail "Copia falhou: $_" }

  Write-Step "Rodando post-deploy..."
  try {
    Invoke-Wsl -Sudo "$WslProjectRoot/deploy/post-deploy.sh"
    Write-Ok "Post-deploy OK!"
  } catch { Write-Warn "Post-deploy warning: $_" }
}

# =====================================================================
# PASSO 3: ABRIR SITE NO NAVEGADOR
# =====================================================================
if ($OpenBrowser) {
  Write-Step "Abrindo http://localhost no navegador..."
  try {
    Start-Process "http://localhost"
    Write-Ok "Pronto! Se o navegador nao abriu, acesse manualmente: http://localhost"
  } catch { Write-Warn "Nao abriu navegador: $_" }
}

Write-Host ""
Write-Host "🎉 Deploy concluido! Acesse: http://localhost" -ForegroundColor Magenta
Write-Host ""
