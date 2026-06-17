#!/usr/bin/env bash
set -e

echo "🚀 Iniciando aplicação..."

# Aguardar banco de dados (healthcheck do compose já valida; fallback curto)
echo "⏳ Aguardando banco de dados..."
sleep 5
echo "✅ Banco pronto!"

# Criar ormconfig.json
echo "📝 Criando ormconfig.json..."
cat > ormconfig.json << EOF
{
    "type": "postgres",
    "port": 5432,
    "host": "database", 
    "username": "docker",
    "password": "admin@01",
    "database": "preparame",
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

# Executar migrações
echo "🔄 Executando migrações..."
sleep 3
npm run typeorm migration:run || echo "⚠️ Erro nas migrações, continuando..."

echo "🎉 Iniciando aplicação..."
exec "$@"