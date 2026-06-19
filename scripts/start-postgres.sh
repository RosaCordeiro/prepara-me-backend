#!/usr/bin/env bash
set -euo pipefail

PGROOT="${PGROOT:-${HOME}/.local/pg-root}"
PGDATA="${PGDATA:-${HOME}/.local/pgsql/data}"
PGPORT="${PGPORT:-5432}"
export PATH="${PGROOT}/usr/lib/postgresql/18/bin:${PATH}"
export LD_LIBRARY_PATH="${PGROOT}/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"

if pg_isready -h localhost -p "${PGPORT}" -U postgres >/dev/null 2>&1; then
    echo "PostgreSQL já está rodando em localhost:${PGPORT}"
    exit 0
fi

mkdir -p "${HOME}/.local/pgsql/logs"
pg_ctl -D "${PGDATA}" -l "${HOME}/.local/pgsql/logs/postgresql.log" start
sleep 2
pg_isready -h localhost -p "${PGPORT}" -U postgres
echo "PostgreSQL iniciado."
