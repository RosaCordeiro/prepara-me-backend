#!/bin/bash
echo "Preparando ambiente..."
chmod +x ./scripts/build.sh
chmod +x ./scripts/pm2_bash.sh
chmod +x ./scripts/check_imports.sh

echo "Checando imports..."
./scripts/check_imports.sh $1

if [ $? -eq 1 ]; then
  echo "Erro na verificação de imports. O deploy foi interrompido."
  exit 1
fi

echo "Rodando o build..."
./scripts/build.sh $1

echo "Rodando o pm2..."
./scripts/pm2_bash.sh $1 $2