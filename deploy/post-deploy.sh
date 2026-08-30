#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/var/www/pagina-host}"

log() {
    echo -e "\033[1;32m[post-deploy]\033[0m $*"
}

log "Ajustando permissoes em $DEPLOY_PATH ..."
chown -R www-data:www-data "$DEPLOY_PATH"
chmod -R 755 "$DEPLOY_PATH"

if command -v nginx &>/dev/null; then
    log "Recarregando Nginx..."
    nginx -t && systemctl reload nginx
fi

log "Deploy concluido com sucesso!"
