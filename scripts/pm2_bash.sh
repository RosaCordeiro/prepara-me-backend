#!/bin/bash
echo "Acessando a pasta do projeto $2"
cd /var/www/app/$1
echo "Apagando a instancia do pm2"
pm2 delete $2
echo "Instancia do pm2 apagada com sucesso"
echo "Inicializando a instancia do pm2"
pm2 start --name "$2" dist/shared/infra/http/server.js
echo "Instancia do pm2 inicializada com sucesso"
