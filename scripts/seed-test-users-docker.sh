#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_CONTAINER="${DB_CONTAINER:-database_preparame}"
DB_USER="${DB_USER:-docker}"
DB_PASS="${DB_PASS:-admin@01}"
DB_NAME="${DB_NAME:-preparame}"

node "${ROOT_DIR}/scripts/build-seed-test-users.js"

export PGPASSWORD="${DB_PASS}"
docker exec -i -e PGPASSWORD="${DB_PASS}" "${DB_CONTAINER}" \
    psql -U "${DB_USER}" -d "${DB_NAME}" -v ON_ERROR_STOP=1 \
    < "${ROOT_DIR}/scripts/seed-test-users.sql"

echo "Usuários de teste criados. Senha de login: Teste@123"
