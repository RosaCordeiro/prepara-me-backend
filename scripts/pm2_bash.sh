#!/bin/bash
echo "Acessando a pasta do projeto $2"
cd /var/www/$1/code
echo "Apagando a instancia do pm2"
pm2 delete $2
echo "Instancia do pm2 apagada com sucesso"
echo "Apagando a instancia da fila do pm2"
pm2 delete $2-queue
echo "Instancia da fila do pm2 apagada com sucesso"
echo "Inicializando a instancia do pm2"
pm2 start --name "$2" dist/main/server.js
echo "Instancia do pm2 inicializada com sucesso"
echo "Inicializando a instancia da fila do pm2"
pm2 start --name "$2-queue" dist/main/queues.js
echo "Instancia da fila do pm2 inicializada com sucesso"
