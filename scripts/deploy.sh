#!/bin/bash
echo "Preparando ambiente..."
chmod +x ./scripts/build.sh
chmod +x ./scripts/pm2_bash.sh
chmod +x ./scripts/check_imports.sh

echo "Checando imports..."
sed -i 's/\r$//' ./scripts/check_imports.sh
./scripts/check_imports.sh $1

if [ $? -eq 1 ]; then
  echo "Erro na verificação de imports. O deploy foi interrompido."
  exit 1
fi

echo "Rodando o build..."
sed -i 's/\r$//' ./scripts/build.sh 
./scripts/build.sh $1

echo "Rodando o pm2..."
sed -i 's/\r$//' ./scripts/pm2_bash.sh
./scripts/pm2_bash.sh $1 $2