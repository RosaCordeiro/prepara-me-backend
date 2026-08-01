#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DUMP_FILE="${1:-}"
DB_CONTAINER="${DB_CONTAINER:-database_preparame}"
APP_CONTAINER="${APP_CONTAINER:-preparame_app}"
DB_USER="${DB_USER:-docker}"
DB_PASS="${DB_PASS:-admin@01}"
DB_NAME="${DB_NAME:-preparame}"

if [ -z "${DUMP_FILE}" ]; then
    mapfile -t FILES < <(find "${ROOT_DIR}/dumps" -maxdepth 1 -name '*.sql' -type f -size +1k 2>/dev/null | sort)
    if [ ${#FILES[@]} -eq 0 ]; then
        echo "Informe o caminho do dump:"
        echo "  bash scripts/restore-dump-docker.sh /caminho/arquivo.sql"
        exit 1
    fi
    DUMP_FILE="${FILES[-1]}"
fi

if [ ! -f "${DUMP_FILE}" ]; then
    echo "Arquivo não encontrado: ${DUMP_FILE}"
    exit 1
fi

SIZE="$(stat -c%s "${DUMP_FILE}")"
if [ "${SIZE}" -eq 0 ]; then
    echo "Arquivo vazio: ${DUMP_FILE}"
    exit 1
fi

echo "Restaurando ${DUMP_FILE} (${SIZE} bytes) no container ${DB_CONTAINER}..."

docker compose -f "${ROOT_DIR}/docker-compose-db.yml" up -d
docker compose -f "${ROOT_DIR}/docker-compose.yml" stop app 2>/dev/null || true

export PGPASSWORD="${DB_PASS}"

docker exec -e PGPASSWORD="${DB_PASS}" "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres -v ON_ERROR_STOP=1 <<'EOF'
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'preparame' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS preparame;
CREATE DATABASE preparame OWNER docker;
EOF

docker exec -e PGPASSWORD="${DB_PASS}" "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'usprepareme') THEN
        CREATE ROLE usprepareme LOGIN PASSWORD 'admin@01';
    END IF;
END
$$;
GRANT ALL PRIVILEGES ON DATABASE preparame TO usprepareme;
SQL

echo "Importando dump (pode levar alguns minutos)..."
docker exec -i -e PGPASSWORD="${DB_PASS}" "${DB_CONTAINER}" \
    psql -U "${DB_USER}" -d "${DB_NAME}" -v ON_ERROR_STOP=1 < "${DUMP_FILE}"

docker exec -e PGPASSWORD="${DB_PASS}" "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" -v ON_ERROR_STOP=1 <<'SQL'
GRANT ALL ON SCHEMA public TO docker;
GRANT ALL ON SCHEMA public TO usprepareme;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO docker;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO docker;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO docker;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO docker;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO docker;
SQL

docker compose -f "${ROOT_DIR}/docker-compose.yml" up -d app

echo "✅ Dump restaurado com sucesso."
