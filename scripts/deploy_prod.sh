#!/bin/bash
echo "Preparando ambiente..."
chmod +x ./scripts/build_prod.sh
chmod +x ./scripts/pm2_bash_prod.sh
chmod +x ./scripts/check_imports_prod.sh

echo "Checando imports..."
sed -i 's/\r$//' ./scripts/check_imports_prod.sh
./scripts/check_imports_prod.sh $1

if [ $? -eq 1 ]; then
  echo "Erro na verificação de imports. O deploy foi interrompido."
  exit 1
fi

echo "Rodando o build..."
sed -i 's/\r$//' ./scripts/build_prod.sh 
./scripts/build_prod.sh $1

echo "Rodando o pm2..."
sed -i 's/\r$//' ./scripts/pm2_bash_prod.sh
./scripts/pm2_bash_prod.sh $1 $2