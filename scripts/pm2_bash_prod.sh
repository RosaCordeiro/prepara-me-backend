#!/bin/bash
echo "Acessando a pasta do projeto $2"
cd /var/www/$1 || { echo "Falha ao acessar a pasta /var/www/$1"; exit 1; }

echo "Verificando se a instância $2 do PM2 já está rodando..."
if pm2 list | grep -q "$2"; then
  echo "Instância encontrada. Atualizando com pm2 restart."
  pm2 restart "$2"
else
  echo "Instância não encontrada. Iniciando com pm2 start."
  pm2 start --name "$2" dist/shared/infra/http/server.js
fi

echo "Processo concluído com sucesso."
