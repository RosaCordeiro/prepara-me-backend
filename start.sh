#!/usr/bin/env bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_title() { echo -e "${CYAN}🚀 $1${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WSL_DB_HOST="$("${SCRIPT_DIR}/wsl-db-host.sh")"

DB_HOST="${DB_HOST:-host.docker.internal}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-docker}"
DB_PASS="${DB_PASS:-admin@01}"
DB_NAME="${DB_NAME:-preparame}"

if [ -f "${PROJECT_DIR}/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "${PROJECT_DIR}/.env"
    set +a
    DB_HOST="${DB_HOST:-host.docker.internal}"
    DB_PORT="${DB_PORT:-5432}"
    DB_USER="${DB_USER:-docker}"
    DB_PASS="${DB_PASS:-admin@01}"
    DB_NAME="${DB_NAME:-preparame}"
fi

check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está acessível."
        print_warning "Se você acabou de entrar no grupo docker, feche e reabra o terminal."
        print_warning "Ou execute: sudo usermod -aG docker \$USER && newgrp docker"
        exit 1
    fi
}

wait_for_db() {
    local host="$1"
    local port="$2"
    print_info "Aguardando PostgreSQL em ${host}:${port}..."

    for i in $(seq 1 30); do
        if PGPASSWORD="${DB_PASS}" pg_isready -h "${host}" -p "${port}" -U "${DB_USER}" -d "${DB_NAME}" > /dev/null 2>&1; then
            print_success "PostgreSQL disponível!"
            return 0
        fi
        sleep 2
    done

    print_error "PostgreSQL indisponível em ${host}:${port}"
    print_warning "Inicie o banco com: ./scripts/start-postgres.sh"
    return 1
}

start_app_docker() {
    print_info "Iniciando API no Docker (PostgreSQL local no WSL)..."
    "${SCRIPT_DIR}/start-postgres.sh" || true
    check_docker
    cd "${PROJECT_DIR}"
    docker compose down > /dev/null 2>&1 || docker-compose down > /dev/null 2>&1
    docker compose up --build -d || docker-compose up --build -d

    if [ $? -eq 0 ]; then
        print_success "API iniciada!"
        print_info "API: http://localhost:3334"
        print_info "Logs: docker compose logs -f app"
    else
        print_error "Erro ao iniciar a API"
        exit 1
    fi
}

start_debug_local() {
    print_info "Iniciando modo debug (Node local + PostgreSQL no WSL)..."
    command -v node > /dev/null || { print_error "Node.js não instalado no WSL."; exit 1; }
    command -v npm > /dev/null || { print_error "npm não instalado no WSL."; exit 1; }

    "${SCRIPT_DIR}/start-postgres.sh" || true
    wait_for_db "localhost" "${DB_PORT}" || exit 1

    cat > "${PROJECT_DIR}/ormconfig.json" << EOF
{
    "type": "postgres",
    "port": ${DB_PORT},
    "host": "localhost",
    "username": "${DB_USER}",
    "password": "${DB_PASS}",
    "database": "${DB_NAME}",
    "synchronize": false,
    "logging": false,
    "migrations": ["./src/shared/infra/typeorm/migrations/*.ts"],
    "entities": ["./src/modules/**/entities/*.ts"],
    "cli": {
        "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
}
EOF

    cd "${PROJECT_DIR}"
    print_success "ormconfig.json criado para debug local."
    print_info "Execute: npm install && npm run typeorm migration:run && npm run dev"
}

stop_services() {
    print_info "Parando serviços..."
    cd "${PROJECT_DIR}"
    docker compose down > /dev/null 2>&1 || docker-compose down > /dev/null 2>&1
    print_success "Containers parados."
}

show_menu() {
    clear
    print_title "PREPARAME API - STARTUP SCRIPT"
    echo ""
    echo "Banco: PostgreSQL local (localhost:${DB_PORT})"
    echo ""
    echo "1) 🐳 API no Docker (recomendado)"
    echo "2) 🐛 Modo debug (Node local + PostgreSQL WSL)"
    echo "3) ⏹️  Parar containers"
    echo "4) 🚪 Sair"
    echo ""
}

while true; do
    show_menu
    read -p "Digite sua escolha (1-4): " choice

    case $choice in
        1) start_app_docker; read -p "Pressione Enter..." ;;
        2) start_debug_local; read -p "Pressione Enter..." ;;
        3) stop_services; read -p "Pressione Enter..." ;;
        4) print_info "Saindo..."; exit 0 ;;
        *) print_error "Opção inválida."; sleep 1 ;;
    esac
done
