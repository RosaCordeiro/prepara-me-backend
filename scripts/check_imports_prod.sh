#!/bin/bash

# Cores
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m"  # No Color

# Diretório do seu projeto
PROJECT_DIR="/var/www/$1"


# Encontra arquivos TypeScript que contenham importações 'src/'
found_files=$(find "$PROJECT_DIR/src" -type f -name "*.ts" -exec grep -l "import .* from 'src/" {} \;)

if [ -n "$found_files" ]; then
  echo -e "${RED}Erro:${NC} Importações 'src/' encontradas nos seguintes arquivos TypeScript dentro da pasta 'src' e suas subpastas:"
  echo -e "$found_files"
  exit 1
fi

echo -e "${GREEN}Nenhuma importação 'src/' encontrada${NC} nos arquivos TypeScript dentro da pasta 'src' e suas subpastas."
exit 0
