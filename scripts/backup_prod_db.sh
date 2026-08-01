#!/usr/bin/env bash
# Backup do Postgres de produção (Prepara.me).
# Projetado para rodar no GitLab Runner com tag preparame_prod (shell no servidor).
set -euo pipefail

PROD_APP_DIR="${PROD_APP_DIR:-/var/www/preparame/api}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/preparame}"
KEEP_LAST="${KEEP_LAST:-10}"
MIN_BYTES="${MIN_BYTES:-10240}" # 10KB — dump vazio/quase vazio falha

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
die() { log "ERRO: $*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "comando obrigatório não encontrado: $1"
}

load_env_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    log "Carregando credenciais de $file"
    set -a
    # shellcheck disable=SC1090
    source "$file"
    set +a
  fi
}

load_ormconfig() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  command -v python3 >/dev/null 2>&1 || return 0
  log "Lendo fallback de $file"
  # Só preenche variáveis ainda vazias (sem sobrescrever .env)
  local host port user pass dbname
  host="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("host") or "")' "$file")"
  port="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("port") or "")' "$file")"
  user="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("username") or "")' "$file")"
  pass="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("password") or "")' "$file")"
  dbname="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("database") or "")' "$file")"
  [[ -z "${DB_HOST:-}" && -n "$host" ]] && DB_HOST="$host"
  [[ -z "${DB_PORT:-}" && -n "$port" ]] && DB_PORT="$port"
  [[ -z "${DB_USER:-}" && -n "$user" ]] && DB_USER="$user"
  [[ -z "${DB_PASS:-}" && -n "$pass" ]] && DB_PASS="$pass"
  [[ -z "${DB_NAME:-}" && -n "$dbname" ]] && DB_NAME="$dbname"
}

require_cmd pg_dump
require_cmd pg_isready
require_cmd sha256sum

load_env_file "${PROD_APP_DIR}/.env"
load_ormconfig "${PROD_APP_DIR}/ormconfig.json"

# Defaults alinhados ao dumps/create_dump.sh (prod = usprepareme @ localhost)
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-usprepareme}"
DB_NAME="${DB_NAME:-preparame}"
DB_PASS="${DB_PASS:-}"

# Host "database" é nome Docker local — em prod no host vira localhost
if [[ "$DB_HOST" == "database" || "$DB_HOST" == "host.docker.internal" ]]; then
  log "Ajustando DB_HOST=${DB_HOST} -> 127.0.0.1 (runner no servidor)"
  DB_HOST="127.0.0.1"
fi

log "Destino do backup: ${BACKUP_ROOT}"
log "Alvo: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
mkdir -p "${BACKUP_ROOT}"

export PGPASSWORD="${DB_PASS}"

if ! pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" >/dev/null 2>&1; then
  die "PostgreSQL indisponível em ${DB_HOST}:${DB_PORT} (user=${DB_USER} db=${DB_NAME}). Verifique .env em ${PROD_APP_DIR}"
fi
log "pg_isready OK"

TS="$(date +'%Y-%m-%d_%H-%M-%S')"
OUT_SQL="${BACKUP_ROOT}/preparame_prod_${TS}.sql"
OUT_META="${OUT_SQL}.meta"
OUT_SHA="${OUT_SQL}.sha256"

log "Iniciando pg_dump -> ${OUT_SQL}"
# Plain SQL (mesmo formato do create_dump.sh histórico) — restaura com psql
pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --no-owner \
  --no-acl \
  -f "${OUT_SQL}"

SIZE="$(stat -c%s "${OUT_SQL}" 2>/dev/null || wc -c < "${OUT_SQL}")"
if [[ "${SIZE}" -lt "${MIN_BYTES}" ]]; then
  rm -f "${OUT_SQL}"
  die "dump suspeito (${SIZE} bytes < ${MIN_BYTES}). Abortado."
fi

sha256sum "${OUT_SQL}" | tee "${OUT_SHA}"
{
  echo "created_at=${TS}"
  echo "host=${DB_HOST}"
  echo "port=${DB_PORT}"
  echo "user=${DB_USER}"
  echo "database=${DB_NAME}"
  echo "bytes=${SIZE}"
  echo "file=${OUT_SQL}"
  echo "ci_commit=${CI_COMMIT_SHA:-local}"
  echo "ci_pipeline=${CI_PIPELINE_ID:-local}"
} > "${OUT_META}"

# Retenção simples: mantém os KEEP_LAST dumps .sql mais recentes
mapfile -t OLD_FILES < <(ls -1t "${BACKUP_ROOT}"/preparame_prod_*.sql 2>/dev/null || true)
if ((${#OLD_FILES[@]} > KEEP_LAST)); then
  for old in "${OLD_FILES[@]:KEEP_LAST}"; do
    log "Removendo backup antigo: ${old}"
    rm -f "${old}" "${old}.meta" "${old}.sha256"
  done
fi

log "BACKUP OK"
log "Arquivo: ${OUT_SQL}"
log "Tamanho: ${SIZE} bytes ($(numfmt --to=iec "${SIZE}" 2>/dev/null || echo "${SIZE}"))"
log "Checksum: ${OUT_SHA}"
log "Para rollback de schema/dados (manual, com cuidado): psql ... -f ${OUT_SQL}"
