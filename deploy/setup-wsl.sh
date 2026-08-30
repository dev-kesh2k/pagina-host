#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/var/www/pagina-host}"
NGINX_CONF_SRC="$(cd "$(dirname "$0")" && pwd)/nginx.conf.example"
NGINX_CONF_DEST="/etc/nginx/sites-available/pagina-host"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled/pagina-host"

log() {
    echo -e "\033[1;34m[setup]\033[0m $*"
}

error() {
    echo -e "\033[1;31m[error]\033[0m $*" >&2
    exit 1
}

require_root() {
    if [[ $EUID -ne 0 ]]; then
        error "Este script precisa rodar com sudo."
    fi
}

require_root

log "Atualizando pacotes..."
apt-get update -qq >/dev/null

log "Instalando Nginx e rsync (se necessario)..."
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx rsync openssh-server >/dev/null

log "Criando diretorio de deploy: $DEPLOY_PATH"
mkdir -p "$DEPLOY_PATH"
chown -R www-data:www-data "$DEPLOY_PATH"
chmod -R 755 "$DEPLOY_PATH"

log "Copiando configuracao do Nginx..."
cp "$NGINX_CONF_SRC" "$NGINX_CONF_DEST"

if [[ ! -f index.html ]] && [[ -d dist ]]; then
    log "Copiando build local para o diretorio de deploy..."
    cp -r dist/* "$DEPLOY_PATH/"
    chown -R www-data:www-data "$DEPLOY_PATH"
fi

log "Habilitando site no Nginx..."
ln -sf "$NGINX_CONF_DEST" "$NGINX_SITES_ENABLED"
rm -f /etc/nginx/sites-enabled/default

log "Testando configuracao do Nginx..."
nginx -t

log "Reiniciando Nginx..."
systemctl restart nginx
systemctl enable nginx

log ""
log "=== Setup concluido com sucesso! ==="
log "Deploy path : $DEPLOY_PATH"
log "Nginx conf  : $NGINX_CONF_DEST"
log "Acesse em   : http://localhost (ou http://$(hostname -I 2>/dev/null | awk '{print $1}'))"
log ""
log "Para habilitar deploy via GitHub Actions, configure as Secrets:"
log "  SSH_HOST        = IP publico / Cloudflare Tunnel / ngrok"
log "  SSH_PORT        = 22 (ou porta customizada)"
log "  SSH_USER        = seu usuario WSL"
log "  SSH_PRIVATE_KEY = chave privada (sem senha)"
log "  DEPLOY_PATH     = $DEPLOY_PATH"
log "  POST_DEPLOY_SCRIPT = (opcional) sudo systemctl reload nginx"
