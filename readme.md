# Preparame API

API backend para o sistema Preparame desenvolvida com Node.js, TypeScript e PostgreSQL.

## 🚀 Início Rápido com Docker

### Pré-requisitos
- Docker e Docker Compose instalados

### Como executar

```bash
# 1. Subir o ambiente completo
docker-compose up --build

# 2. Ou em background
docker-compose up --build -d
```

**Pronto!** A API estará rodando em: http://localhost:3334

### Como parar
```bash
docker-compose down
```

## 📊 Restaurar Banco de Dados

### 1. Colocar arquivo .sql na pasta dumps/
```bash
cp meu_backup.sql dumps/
```

### 2. Executar o script de restore
```bash
./dumps/restore-dump.sh
```

O script irá:
- Mostrar arquivos .sql disponíveis
- Limpar o banco atual (com confirmação)
- Restaurar o dump selecionado

## 🔧 Comandos Úteis

```bash
# Ver logs da aplicação
docker-compose logs -f app

# Ver logs do banco
docker-compose logs -f database

# Acessar o banco diretamente
docker-compose exec database psql -U docker -d preparame

# Acessar shell da aplicação
docker-compose exec app bash

# Executar migrações manualmente
docker-compose exec app npm run typeorm migration:run
```

## 🌍 Configurações

### Portas da Aplicação
- API: http://localhost:3334
- Debug: 9230

## 🛠️ Desenvolvimento

### Problemas Comuns

**Erro "no such file or directory":**
- No Windows, converta arquivos para LF: `dos2unix scripts/*.sh`
- Ou use WSL2

**Erro de permissão:**
```bash
chmod +x scripts/*.sh dumps/*.sh
```

**Limpar tudo e recomeçar:**
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

