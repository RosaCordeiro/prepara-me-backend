#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

run_docker() {
    if docker info > /dev/null 2>&1; then
        docker "$@"
        return
    fi

    if sudo -n docker info > /dev/null 2>&1; then
        sudo docker "$@"
        return
    fi

    echo "Docker inacessível. Saia e entre no WSL ou execute: newgrp docker"
    exit 1
}

if [ ! -f .env ]; then
    cp .env.exemple .env
fi

echo "Subindo API no Docker (PostgreSQL local no WSL)..."
"${ROOT_DIR}/scripts/start-postgres.sh" || true
run_docker compose down > /dev/null 2>&1 || true
run_docker compose up --build -d

echo "API: http://localhost:3334"
echo "Logs: docker compose logs -f app"
