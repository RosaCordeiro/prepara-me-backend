#!/usr/bin/env bash
# Atualiza .env da API em produção para liberar /admin/backups
# Uso no runner preparame_prod (sem precisar de SSH manual).
set -euo pipefail

PROD_APP_DIR="${PROD_APP_DIR:-/var/www/preparame/api}"
ENV_FILE="${PROD_APP_DIR}/.env"
PM2_NAME="${PM2_NAME:-preparame-api}"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
die() { log "ERRO: $*"; exit 1; }

[[ -d "${PROD_APP_DIR}" ]] || die "Pasta da API nao encontrada: ${PROD_APP_DIR}"
[[ -f "${ENV_FILE}" ]] || die "Arquivo .env nao encontrado: ${ENV_FILE}"

upsert_env() {
  local key="$1"
  local value="$2"
  local tmp
  tmp="$(mktemp)"

  if grep -qE "^${key}=" "${ENV_FILE}"; then
    # preserva demais linhas; troca só a chave
    awk -v k="${key}" -v v="${value}" '
      BEGIN { updated=0 }
      $0 ~ ("^" k "=") {
        print k "=" v
        updated=1
        next
      }
      { print }
      END {
        if (!updated) print k "=" v
      }
    ' "${ENV_FILE}" > "${tmp}"
    mv "${tmp}" "${ENV_FILE}"
    log "Atualizado ${key}"
  else
    printf '\n%s=%s\n' "${key}" "${value}" >> "${ENV_FILE}"
    log "Adicionado ${key}"
  fi
}

log "Habilitando API de backup em ${ENV_FILE}"

# Cópia de segurança do .env antes de alterar
TS="$(date +'%Y-%m-%d_%H-%M-%S')"
cp -a "${ENV_FILE}" "${ENV_FILE}.bak.${TS}"
log "Backup do .env: ${ENV_FILE}.bak.${TS}"

upsert_env "ENABLE_DB_BACKUP_API" "true"
upsert_env "BACKUP_ROOT" "${BACKUP_ROOT:-/var/backups/preparame}"
upsert_env "DB_BACKUP_KEEP_LAST" "${DB_BACKUP_KEEP_LAST:-10}"

# Token opcional: só grava se a variável de CI/ambiente vier preenchida
if [[ -n "${DB_BACKUP_API_TOKEN:-}" ]]; then
  upsert_env "DB_BACKUP_API_TOKEN" "${DB_BACKUP_API_TOKEN}"
  log "DB_BACKUP_API_TOKEN definido via CI variable"
else
  log "DB_BACKUP_API_TOKEN nao informado — backup Admin segue so com JWT ADMIN"
fi

# Garante pasta de backups
mkdir -p "${BACKUP_ROOT:-/var/backups/preparame}" || true

log "Reiniciando PM2 (${PM2_NAME}) para carregar o .env"
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -q "${PM2_NAME}"; then
    pm2 restart "${PM2_NAME}"
  else
    die "Instancia PM2 '${PM2_NAME}' nao encontrada"
  fi
else
  die "pm2 nao encontrado no servidor"
fi

log "OK — ENABLE_DB_BACKUP_API=true aplicado e API reiniciada"
log "No Admin: Operacoes > Backup do Banco"
