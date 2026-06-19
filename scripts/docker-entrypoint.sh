#!/usr/bin/env bash
set -e

DB_HOST="${DB_HOST:-host.docker.internal}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-docker}"
DB_PASS="${DB_PASS:-admin@01}"
DB_NAME="${DB_NAME:-preparame}"

echo "🚀 Iniciando aplicação..."
echo "📡 Banco externo: ${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "⏳ Aguardando banco de dados..."
for i in $(seq 1 60); do
    if PGPASSWORD="${DB_PASS}" pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" > /dev/null 2>&1; then
        echo "✅ Banco pronto!"
        break
    fi

    if [ "${i}" -eq 60 ]; then
        echo "❌ Banco indisponível em ${DB_HOST}:${DB_PORT}"
        echo "   Verifique se o PostgreSQL está rodando no Windows."
        echo "   Execute: powershell.exe -File scripts/setup-windows-postgres.ps1"
        exit 1
    fi

    echo "Aguardando banco... (${i}/60)"
    sleep 2
done

echo "📝 Criando ormconfig.json..."
cat > ormconfig.json << EOF
{
    "type": "postgres",
    "port": ${DB_PORT},
    "host": "${DB_HOST}",
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
echo "✅ ormconfig.json criado!"

echo "🔄 Executando migrações..."
sleep 2
npm run typeorm migration:run || echo "⚠️ Erro nas migrações, continuando..."

echo "🎉 Iniciando aplicação..."
exec "$@"
