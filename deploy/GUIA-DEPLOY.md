# 🔧 Guia Completo de Configuração - Deploy GitHub → WSL

Este guia vai te ensinar a configurar TUDO, do zero, para que cada push no GitHub
atualize automaticamente o Kesh Dashboard no seu servidor WSL.

---

## 📋 Sumário
1. [Configurar o WSL (servidor)](#1-configurar-o-wsl-servidor)
2. [Liberar acesso SSH externo](#2-liberar-acesso-ssh-externo)
3. [Gerar chave SSH de deploy](#3-gerar-chave-ssh-de-deploy)
4. [Configurar Secrets no GitHub](#4-configurar-secrets-no-github)
5. [Fazer o primeiro deploy](#5-fazer-o-primeiro-deploy)
6. [Resolver problemas comuns](#6-resolver-problemas-comuns)

---

## 1. Configurar o WSL (servidor)

Abra o terminal do WSL (Ubuntu/Debian) e execute:

```bash
# 1. Entre na pasta do projeto (ajuste o caminho se clonou em outro lugar)
cd ~/pagina-host   # ou /mnt/c/Users/Jefer/Documents/GitHub/pagina-host

# 2. De permissao de execucao aos scripts
chmod +x deploy/*.sh

# 3. Rode o setup automatico
sudo ./deploy/setup-wsl.sh
```

O que esse script faz automaticamente:
- ✅ Instala Nginx, rsync e openssh-server
- ✅ Cria a pasta `/var/www/pagina-host` (onde o site vai ficar)
- ✅ Copia a configuracao do Nginx
- ✅ Liga o servico do Nginx no boot do WSL

Para confirmar que deu certo, abra no navegador do Windows:
```
http://localhost
```

Se aparecer uma pagina "Welcome to nginx!", funciona.
Se aparecer uma pagina vazia ou o dashboard, funciona tambem.

---

## 2. Liberar acesso SSH externo

### 🅰️ Opcao RECOMENDADA: Cloudflare Tunnel (Grátis, sem IP público)

Você precisa de uma conta gratuita no https://www.cloudflare.com/

No WSL, execute:

```bash
# 1. Instale o cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
sudo mv cloudflared /usr/local/bin/
sudo chmod +x /usr/local/bin/cloudflared

# 2. Autentique (vai abrir uma aba no navegador)
cloudflared tunnel login

# 3. Crie um tunel chamado "meu-wsl"
cloudflared tunnel create meu-wsl
```

Guarde o UUID que apareceu (ex: `a1b2c3d4-1234-5678-90ab-cdef01234567`),
voce vai precisar dele.

```bash
# 4. Crie o arquivo de configuracao (coloque SEU UUID abaixo)
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: COLOQUE-SEU-UUID-AQUI
credentials-file: /home/SEU_USUARIO/.cloudflared/COLOQUE-SEU-UUID-AQUI.json

ingress:
  - hostname: ssh.seudominio.com
    service: ssh://localhost:22
  - service: http_status:404
EOF
```

⚠️ Substitua:
- `COLOQUE-SEU-UUID-AQUI` pelo UUID que apareceu
- `/home/SEU_USUARIO` pelo seu usuario (ex: `/home/kesh`)
- `ssh.seudominio.com` por um subdominio do seu dominio (tem que estar no Cloudflare)

```bash
# 5. Crie a entrada DNS automaticamente
cloudflared tunnel route dns meu-wsl ssh.seudominio.com

# 6. Instale como servico (roda em segundo plano)
sudo cloudflared --config ~/.cloudflared/config.yml service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

# 7. Verifique se esta rodando
sudo systemctl status cloudflared
```

### 🅱️ Opcao SIMPLES (sem dominio): ngrok

Se não quiser configurar Cloudflare/dominio, use ngrok (temporario, gratuito).

A desvantagem: a URL/porta muda toda vez que reiniciar.

```bash
# Instale ngrok (registre-se gratuitamente em ngrok.com)
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install -y ngrok

# Configure seu token (pegue em dashboard.ngrok.com)
ngrok config add-authtoken SEU_TOKEN_AQUI

# Rode o tunel SSH em segundo plano
ngrok tcp 22 --log=stdout > ~/ngrok.log &
```

Pegue as informacoes do tunel:
```bash
curl http://localhost:4040/api/tunnels | grep -o '"public_url":"tcp://[^"]*"'
```

Vai aparecer algo como:
```
tcp://0.tcp.sa.ngrok.io:12345
                     ↑↑↑↑↑   ──→ Essa é a SSH_PORT
        ↑─────────────────    ──→ Esse é o SSH_HOST (sem "tcp://")
```

---

## 3. Gerar chave SSH de deploy

No terminal do WSL, rode (NAO COLOQUE SENHA!):

```bash
# Gera a chave (pressiona Enter para tudo)
ssh-keygen -t ed25519 -C "github-deploy-pagina-host" -f ~/.ssh/id_ed25519 -N ""

# Autoriza a propria chave a logar no seu WSL
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Teste se funciona (deve logar sem senha)
ssh -i ~/.ssh/id_ed25519 $(whoami)@localhost -p 22 "echo 'SSH funciona!'"
```

Agora PEGUE AS CHAVES (voce vai colar no GitHub):

```bash
# Para ver a CHAVE PRIVADA (cole em SSH_PRIVATE_KEY no GitHub):
echo "============= SSH_PRIVATE_KEY (COPIA TUDO ABAIXO) ============="
cat ~/.ssh/id_ed25519
echo "=============================================================="
```

---

## 4. Configurar Secrets no GitHub

Abra no navegador (sua conta GitHub):

```
https://github.com/dev-kesh2k/pagina-host/settings/secrets/actions
```

Clique em **New repository secret** e cria as 6 secrets abaixo, uma por uma:

---

### 🔑 Secret 1: `SSH_HOST`

| Campo | Valor |
|---|---|
| **Name** | `SSH_HOST` |
| **Secret** | Dependendo do tunel que usou: |

- **Cloudflare Tunnel**: `ssh.seudominio.com` (seu subdominio)
- **ngrok**: exemplo `0.tcp.sa.ngrok.io` (o que apareceu no `public_url`, **sem** `tcp://` e **sem** a porta)

---

### 🔌 Secret 2: `SSH_PORT`

| Campo | Valor |
|---|---|
| **Name** | `SSH_PORT` |
| **Secret** | Dependendo do tunel: |

- **Cloudflare Tunnel**: `22`
- **ngrok**: o numero depois dos `:` (ex: `12345`)

---

### 👤 Secret 3: `SSH_USER`

| Campo | Valor |
|---|---|
| **Name** | `SSH_USER` |
| **Secret** | Seu usuario do WSL |

Para descobrir, digite no WSL: `whoami`

Exemplos: `kesh`, `jefer`, `ubuntu`

---

### 🔐 Secret 4: `SSH_PRIVATE_KEY`

| Campo | Valor |
|---|---|
| **Name** | `SSH_PRIVATE_KEY` |
| **Secret** | COPIA E COLA TUDO do comando abaixo (INCLUINDO as linhas BEGIN e END): |

```bash
cat ~/.ssh/id_ed25519
```

Deve ficar assim:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
muitas linhas aqui
...
AAAAC3NzaC1lZDI1NTE5AAAAIB...
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **COLOQUE TUDO**, incluindo as linhas `-----BEGIN...` e `-----END...`!

---

### 📂 Secret 5: `DEPLOY_PATH`

| Campo | Valor |
|---|---|
| **Name** | `DEPLOY_PATH` |
| **Secret** | `/var/www/pagina-host` |

Use exatamente esse valor, a menos que voce mudou no nginx.

---

### 🔄 Secret 6: `POST_DEPLOY_SCRIPT`

| Campo | Valor |
|---|---|
| **Name** | `POST_DEPLOY_SCRIPT` |
| **Secret** | (abaixo, ajuste SEU_USUARIO) |

```
sudo /home/SEU_USUARIO/pagina-host/deploy/post-deploy.sh
```

Troque `SEU_USUARIO` pelo seu usuario do WSL.
Exemplo: `sudo /home/kesh/pagina-host/deploy/post-deploy.sh`

📌 **Importante**: Deixe o seu usuario executar sudo SEM senha para o post-deploy:
```bash
# No WSL:
sudo visudo -f /etc/sudoers.d/deploy-pagina
```

Cole essa linha (troque SEU_USUARIO):
```
SEU_USUARIO ALL=(ALL) NOPASSWD: /home/SEU_USUARIO/pagina-host/deploy/post-deploy.sh
```

Salve (Ctrl+O, Enter, Ctrl+X).

---

## 5. Fazer o primeiro deploy

### 📤 Commit e push

No Windows (PowerShell ou Git Bash), dentro da pasta do projeto:

```powershell
cd C:\Users\Jefer\Documents\GitHub\pagina-host

git add .github deploy
git commit -m "feat: add CI/CD deploy pipeline + setup scripts"
git push origin main
```

### 👀 Acompanhe a pipeline

Abra no navegador:
```
https://github.com/dev-kesh2k/pagina-host/actions
```

Você deve ver um workflow **Build and Deploy to WSL Server** rodando (amarelo).
Espere ficar **verde** (completo). Se ficar **vermelho**, veja o erro e consulte o item 6.

### ✅ Verifique o site

Quando a pipeline ficar verde, acesse no navegador do Windows:
```
http://localhost
```

Seu Kesh Dashboard deve aparecer, atualizado! 🎉

---

## 6. Resolver problemas comuns

### ❌ Problema: "Connection refused" ou "SSH timed out"

**Causa**: Tunel SSH (Cloudflare/ngrok) nao esta ativo, ou porta errada.

**Solução**:
- ngrok: rode `ngrok tcp 22` de novo, a porta mudou, atualize as Secrets
- Cloudflare: `sudo systemctl status cloudflared` → verifique se esta ativo

### ❌ Problema: "Permission denied (publickey)"

**Causa**: Chave SSH privada nao corresponde a publica em `authorized_keys`.

**Solução**:
- No WSL, regere as chaves (passo 3)
- Confirme que colou TUDO, incluindo `-----BEGIN` e `-----END`

### ❌ Problema: "rsync failed" ou "Permission denied" em /var/www

**Causa**: Usuário nao tem permissao de escrita na pasta.

**Solução** (no WSL):
```bash
sudo chown -R SEU_USUARIO:www-data /var/www/pagina-host
sudo chmod -R 775 /var/www/pagina-host
```

### ❌ Problema: nginx mostra pagina 403 Forbidden

**Causa**: Permissoes erradas ou nao tem `index.html`.

**Solução** (rode no WSL apos o primeiro deploy):
```bash
ls -la /var/www/pagina-host
# Deve ter index.html la. Verifica se o usuario www-data consegue ler.
```

### ❌ Problema: SPA (React) mostra 404 ao recarregar

**Causa**: Regra `try_files` do Nginx nao ativa.

**Solução**: Confirme que a config do nginx `nginx.conf.example` foi copiada:
```bash
# Testa a config
sudo nginx -t
# Se tiver OK, recarrega:
sudo systemctl reload nginx
```

---

## 📞 Precisando de ajuda?

Guarde este arquivo e, se travar em qualquer passo, abre uma issue no repo ou
rode a pipeline com um erro especifico e leia o log do GitHub Actions (ele
sempre diz exatamente qual parte quebrou: conectar SSH? copiar arquivos?
permissoes?).

Bom deploy! 🚀
