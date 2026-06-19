#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PREFIX="${PGROOT:-${HOME}/.local/pg-root}"
PGDATA="${PGDATA:-${HOME}/.local/pgsql/data}"
PGPORT="${PGPORT:-5432}"
SOCKET_DIR="${HOME}/.local/pgsql/run"
BACKUP_PATH="${1:-/mnt/c/Users/995670.CLAMED/Downloads/Banco de Dados - Prepara.me - 062026.sql}"
DEB_DIR="${TMPDIR:-/tmp}/pg-debs"

export PATH="${PREFIX}/usr/lib/postgresql/18/bin:${PATH}"
export LD_LIBRARY_PATH="${PREFIX}/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"

log() { echo "[setup-wsl-postgres] $*"; }

install_packages() {
    if [ -x "${PREFIX}/usr/lib/postgresql/18/bin/postgres" ]; then
        log "PostgreSQL já extraído em ${PREFIX}"
        return
    fi

    log "Baixando pacotes PostgreSQL (sem sudo)..."
    mkdir -p "${DEB_DIR}" "${PREFIX}"
    cd "${DEB_DIR}"

    apt-get download \
        postgresql-18 postgresql-client-18 postgresql-common postgresql-client-common \
        libpq5 libicu78 libnuma1 liburing2 2>/dev/null

    for deb in "${DEB_DIR}"/*.deb; do
        dpkg-deb -x "${deb}" "${PREFIX}"
    done
}

init_cluster() {
    if [ -f "${PGDATA}/PG_VERSION" ]; then
        log "Cluster já existe em ${PGDATA}"
        return
    fi

    log "Inicializando cluster..."
    mkdir -p "${SOCKET_DIR}" "${HOME}/.local/pgsql/logs"
    initdb -D "${PGDATA}" -U postgres --encoding=UTF8 --locale=C

    {
        echo "listen_addresses = '*'"
        echo "port = ${PGPORT}"
        echo "unix_socket_directories = '${SOCKET_DIR}'"
    } >> "${PGDATA}/postgresql.conf"

    cat >> "${PGDATA}/pg_hba.conf" <<'EOF'
local   all             all                                     trust
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             172.16.0.0/12           scram-sha-256
EOF
}

start_postgres() {
    if pg_isready -h localhost -p "${PGPORT}" -U postgres >/dev/null 2>&1; then
        log "PostgreSQL já está rodando."
        return
    fi

    log "Iniciando PostgreSQL..."
    pg_ctl -D "${PGDATA}" -l "${HOME}/.local/pgsql/logs/postgresql.log" start
    sleep 2
    pg_isready -h localhost -p "${PGPORT}" -U postgres
}

create_database() {
    log "Criando usuário/database..."
    psql -h localhost -p "${PGPORT}" -U postgres -v ON_ERROR_STOP=1 \
        -f "${ROOT_DIR}/scripts/create-database.sql"
}

write_env() {
    cat > "${ROOT_DIR}/.env" <<EOF
##Database (PostgreSQL local no WSL)
DB_HOST=localhost
DB_PORT=${PGPORT}
DB_USER=docker
DB_PASS=admin@01
DB_NAME=preparame

##API Urls
FORGOT_MAIL_URL=
APP_API_URL=
APP_API_URL_PLATFORM=

##AWS Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
AWS_BUCKET_REGION=
AWS_BUCKET_URL=
AWS_REGION=

##storage
disk=

##email
MAIL_PROVIDER=

##googleCalendar
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=

##system
TIMEZONE=
EOF
}

restore_backup() {
    if [ ! -f "${BACKUP_PATH}" ]; then
        log "Backup não encontrado: ${BACKUP_PATH}"
        return 1
    fi

    local size
    size="$(stat -c%s "${BACKUP_PATH}")"
    if [ "${size}" -eq 0 ]; then
        log "AVISO: backup vazio (0 bytes): ${BACKUP_PATH}"
        log "Copie um dump válido e rode:"
        log "  ./dumps/restore-dump.sh \"${BACKUP_PATH}\""
        return 1
    fi

    log "Restaurando backup (${size} bytes)..."
    bash "${ROOT_DIR}/dumps/restore-dump.sh" "${BACKUP_PATH}"
}

write_profile_snippet() {
    local marker="# preparame-postgres-path"
    if ! grep -q "${marker}" "${HOME}/.bashrc" 2>/dev/null; then
        cat >> "${HOME}/.bashrc" <<EOF

${marker}
export PGROOT="\${HOME}/.local/pg-root"
export PGDATA="\${HOME}/.local/pgsql/data"
export PATH="\${PGROOT}/usr/lib/postgresql/18/bin:\${PATH}"
export LD_LIBRARY_PATH="\${PGROOT}/usr/lib/x86_64-linux-gnu:\${LD_LIBRARY_PATH:-}"
EOF
    fi
}

main() {
    install_packages
    init_cluster
    start_postgres
    create_database
    write_env
    write_profile_snippet
    restore_backup || true
    log "Pronto: localhost:${PGPORT} | user=docker | db=preparame"
}

main "$@"
