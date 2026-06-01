#!/bin/bash

# Função para obter a data e hora atuais
get_current_datetime() {
  echo $(date +"%Y-%m-%d_%H-%M-%S")
}

# Seleção do ambiente
echo "Selecione a categoria desejada:"
select SELECT_SERVER in "Homolog" "Prod"; do
  case $SELECT_SERVER in
    Homolog)
      SERVER="carta_homolog"
      ENV_NAME="homolog"
      break
      ;;
    Prod)
      SERVER="preparame"
      ENV_NAME="prod"
      break
      ;; 
    *)
      echo "Seleção inválida. Tente novamente."
      ;;
  esac
done


# Nome do banco de dados e do arquivo de backup
database_name="preparame"
current_datetime=$(get_current_datetime)
backup_file="${database_name}_${ENV_NAME}_${current_datetime}"
backup_path="/root/$backup_file.sql"

# Executar o pg_dump no servidor remoto com as variáveis personalizadas
# ssh "$SERVER" "pg_dump -U root -d $database_name -Fc -f $backup_path"

if [ "$SERVER" == "carta_homolog" ]; then
    ssh "$SERVER" "pg_dump -Uwhow -p5432 -h 127.0.0.1 -d $database_name > $backup_path"
else
    ssh "$SERVER" "pg_dump -Uusprepareme -p5432 -h 127.0.0.1 -d $database_name > $backup_path"
fi

echo "Backup do banco de dados '$database_name' para o cliente '$selected_client' no ambiente '$ENV_NAME' foi salvo como '$backup_file'."

# Usar scp para copiar o arquivo de backup para o ~/Downloads local
if [ "$SERVER" == "carta_homolog" ]; then
    scp "$SERVER:$backup_path" "dumps/"
else
    scp "$SERVER:$backup_path" "dumps/"
fi

echo "Backup '$backup_file' foi baixado para '$HOME/Downloads/'."
