#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="${HOME}/.local/pg-root/usr/lib/postgresql/18/bin:${PATH}"
export LD_LIBRARY_PATH="${HOME}/.local/pg-root/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"

"${ROOT_DIR}/scripts/start-postgres.sh"
psql -h localhost -p 5432 -U postgres -d preparame -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/scripts/seed-test-users.sql"

echo "Usuários de teste criados. Senha de login: Teste@123"
