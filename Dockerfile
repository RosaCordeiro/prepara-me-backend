FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache bash postgresql-client curl

WORKDIR /usr/app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Instalar ferramentas globais
RUN npm install -g ts-node typescript

# Copiar código fonte
COPY . .

# Dar permissão ao script
RUN chmod +x ./scripts/docker-entrypoint.sh

# Criar diretórios
RUN mkdir -p /usr/app/tmp/avatar /usr/app/logs

# Expor portas
EXPOSE 3334 3335 9230

CMD ["npm", "run", "dev"]