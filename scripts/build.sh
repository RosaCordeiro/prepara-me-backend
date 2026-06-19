#!/bin/bash
echo "Acessando a pasta do projeto $1"
cd /var/www/app/$1
echo "Apagando o build anterior"
rm -rf dist
echo "Apagando o node_modules anterior"
rm package-lock.json
rm -rf node_modules
echo "Instalando as dependências"
npm install
echo "Gerando o build"
npm run build
echo "Build gerado com sucesso"
npm run typeorm migration:run   
echo "Migrations executadas com sucesso"
npm run build
echo "Build gerado com sucesso"





