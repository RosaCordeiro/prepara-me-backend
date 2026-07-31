#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-docker}"
DB_PASS="${DB_PASS:-admin@01}"
DB_NAME="${DB_NAME:-preparame}"
DUMP_FILE="${1:-}"

if [ -f "${PROJECT_DIR}/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "${PROJECT_DIR}/.env"
    set +a
fi

show_status() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

if [ -z "${DUMP_FILE}" ]; then
    DUMPS_PATH="${PROJECT_DIR}/dumps"
    mapfile -t FILES < <(find "${DUMPS_PATH}" -maxdepth 1 -name '*.sql' -type f 2>/dev/null | xargs -n1 basename 2>/dev/null || true)

    if [ ${#FILES[@]} -eq 0 ]; then
        echo "Informe o caminho do dump:"
        echo "  ./dumps/restore-dump.sh \"/caminho/arquivo.sql\""
        exit 1
    fi

    echo "Selecione o arquivo de dump (.sql):"
    select SELECTED in "${FILES[@]}"; do
        if [ -n "${SELECTED}" ]; then
            DUMP_FILE="${DUMPS_PATH}/${SELECTED}"
            break
        fi
        echo "Seleção inválida."
    done
fi

if [ ! -f "${DUMP_FILE}" ]; then
    show_status "Arquivo não encontrado: ${DUMP_FILE}"
    exit 1
fi

SIZE="$(stat -c%s "${DUMP_FILE}")"
if [ "${SIZE}" -eq 0 ]; then
    show_status "Erro: arquivo vazio (0 bytes): ${DUMP_FILE}"
    exit 1
fi

echo ""
echo "⚠️  ATENÇÃO: este processo apaga o conteúdo do banco '${DB_NAME}'."
read -p "Deseja continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    show_status "Operação cancelada."
    exit 0
fi

export PGPASSWORD="${DB_PASS}"

show_status "Limpando banco em localhost:${DB_PORT}..."
psql -h localhost -p "${DB_PORT}" -U postgres -d "${DB_NAME}" -v ON_ERROR_STOP=1 <<'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
EOF

psql -h localhost -p "${DB_PORT}" -U postgres -d postgres -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'usprepareme') THEN
        CREATE ROLE usprepareme LOGIN PASSWORD 'admin@01';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'docker') THEN
        CREATE ROLE docker LOGIN PASSWORD 'admin@01';
    END IF;
END
$$;
GRANT ALL PRIVILEGES ON DATABASE preparame TO usprepareme;
GRANT ALL PRIVILEGES ON DATABASE preparame TO docker;
SQL

show_status "Restaurando dump (${SIZE} bytes)..."
unset PGPASSWORD
psql -h localhost -p "${DB_PORT}" -U postgres -d "${DB_NAME}" -v ON_ERROR_STOP=1 -f "${DUMP_FILE}"

psql -h localhost -p "${DB_PORT}" -U postgres -d "${DB_NAME}" -v ON_ERROR_STOP=1 <<'SQL'
GRANT ALL ON SCHEMA public TO docker;
GRANT ALL ON SCHEMA public TO usprepareme;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO docker;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO docker;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO docker;
SQL

show_status "✅ Restauração concluída."
