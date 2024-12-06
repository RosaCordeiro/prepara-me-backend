#!/bin/bash

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

# Listar os arquivos na pasta de DUMPs
FILES=($(ls -p $DUMPS_PATH | grep -v /))

# Verificar se existem arquivos na pasta de DUMPs
if [ ${#FILES[@]} -eq 0 ]; then
    echo "Nenhum arquivo de dump encontrado na pasta $DUMPS_PATH."
    exit 1
fi

echo "Selecione o arquivo de dump desejado:"
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



# Conecta ao container e restaura o dump do PostgreSQL
docker exec -i $CONTAINER_NAME /usr/bin/psql --host=localhost --port=5432 --username=docker -Fp -d preparame <  "./dumps/$DUMP_FILE"

show_status "Restauração concluída."