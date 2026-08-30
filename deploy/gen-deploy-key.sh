#!/usr/bin/env bash
set -euo pipefail

KEYPATH="/home/jefer/.ssh/id_ed25519"

rm -f "$KEYPATH" "${KEYPATH}.pub"

# gera chave SEM senha, SEM criptografia
ssh-keygen \
  -t ed25519 \
  -C "github-deploy-sem-senha" \
  -f "$KEYPATH" \
  -N "" \
  -q \
  -Z none

# Testa de verdade
PUB_AGAIN=$(ssh-keygen -y -P "" -f "$KEYPATH")
echo "=== CHAVE PUBLICA (OK se nao pediu senha): ==="
echo "$PUB_AGAIN"

# autoriza no servidor
cat "${KEYPATH}.pub" > /home/jefer/.ssh/authorized_keys
chown jefer:jefer /home/jefer/.ssh/authorized_keys /home/jefer/.ssh/id_ed25519 /home/jefer/.ssh/id_ed25519.pub
chmod 700 /home/jefer/.ssh
chmod 600 /home/jefer/.ssh/authorized_keys /home/jefer/.ssh/id_ed25519

echo ""
echo "=== COPIE A CHAVE PRIVADA ABAIXO (USE ELA NO GITHUB): ==="
echo "============= NOVA SSH_PRIVATE_KEY (COPIA TUDO ABAIXO) ============="
cat "$KEYPATH"
echo "===================================================================="
