#!/usr/bin/env bash

# Função para exibir mensagens de status
show_status() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

show_status "Iniciando o processo de restauração do banco de dados..."

# Concatena a variável CLIENT com "-database" para obter o nome do container
CONTAINER_NAME="database_preparame"

show_status "Conectando ao container $CONTAINER_NAME..."

# Caminho para a pasta de DUMPs
DUMPS_PATH="dumps"

# Listar apenas arquivos .sql na pasta de DUMPs
FILES=($(ls -p $DUMPS_PATH/*.sql 2>/dev/null | xargs -n 1 basename 2>/dev/null))

# Verificar se existem arquivos .sql na pasta de DUMPs
if [ ${#FILES[@]} -eq 0 ]; then
    echo "Nenhum arquivo .sql encontrado na pasta $DUMPS_PATH."
    exit 1
fi

echo "Selecione o arquivo de dump (.sql) desejado:"
select DUMP_FILE in "${FILES[@]}"; do
  if [ -n "$DUMP_FILE" ]; then
    break
  else
    echo "Seleção inválida. Tente novamente."
  fi
done

echo "Você selecionou: $DUMP_FILE"

# Verifica se o arquivo de dump existe
if [ ! -f "./dumps/$DUMP_FILE" ]; then
    echo "Arquivo de dump '$DUMP_FILE' não encontrado na pasta /dumps."
    exit 1
fi

# Função para limpar todas as tabelas do banco
clean_database() {
    show_status "🧹 Limpando todas as tabelas do banco de dados..."
    
    # Script SQL para dropar todas as tabelas
    DROP_SCRIPT=$(cat << 'EOF'
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Dropar todas as tabelas
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Dropar todas as sequences
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
    
    -- Dropar todas as views
    FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.table_name) || ' CASCADE';
    END LOOP;
    
    -- Dropar todos os tipos customizados
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;
EOF
)
    
    echo "$DROP_SCRIPT" | docker-compose exec -T database psql -U docker -d preparame
    
    if [ $? -eq 0 ]; then
        show_status "✅ Banco de dados limpo com sucesso!"
    else
        show_status "❌ Erro ao limpar o banco de dados"
        exit 1
    fi
}

# Confirmar limpeza do banco
echo ""
echo "⚠️  ATENÇÃO: Este processo irá APAGAR TODAS as tabelas, sequences, views e tipos do banco 'preparame'!"
read -p "Deseja continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    show_status "Operação cancelada pelo usuário."
    exit 0
fi

# Limpar banco antes da restauração
clean_database

# Conecta ao container e restaura o dump do PostgreSQL
show_status "📥 Iniciando restauração do dump: $DUMP_FILE"
docker-compose exec -T database psql -U docker -d preparame < "./dumps/$DUMP_FILE"

if [ $? -eq 0 ]; then
    show_status "✅ Restauração concluída com sucesso!"
else
    show_status "❌ Erro durante a restauração do dump"
    exit 1
fi