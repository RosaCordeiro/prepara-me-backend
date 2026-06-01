# Preparame API

API backend para o sistema Preparame desenvolvida com Node.js, TypeScript e PostgreSQL.

## 🚀 Início Rápido

### Pré-requisitos

-   Docker e Docker Compose instalados
-   Node.js (para modo debug)

### Como executar

```bash
# Script interativo com menu de opções
./start.sh
```

O script mostrará um menu com as opções:

1. **🐳 Ambiente Completo (Docker)** - App + Banco no Docker
2. **🐛 Modo Debug** - Só banco Docker + Node local para debugger
3. **🗄️ Apenas Banco** - Só PostgreSQL
4. **⏹️ Parar Serviços** - Para todos os containers
5. **🚪 Sair**

**Pronto!** A API estará rodando em: http://localhost:3334

### Modo Debug (Desenvolvimento)

O modo debug é perfeito para desenvolvimento com debugger:

1. **Execute o script:**

    ```bash
    ./start.sh
    ```

    - Selecione a opção **2) 🐛 Modo Debug**

2. **No VS Code:**

    - Pressione `F5` ou vá em Run > Start Debugging
    - Escolha a configuração "Debug Preparame API"
    - Coloque breakpoints no código
    - API rodará em modo debug em http://localhost:3334

3. **Vantagens:**
    - Breakpoints funcionam perfeitamente
    - Hot reload automático
    - Logs diretos no terminal VS Code
    - Banco isolado no Docker

### Comandos Tradicionais

```bash
# Ainda funcionam se preferir
docker-compose up --build
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

-   Mostrar arquivos .sql disponíveis
-   Limpar o banco atual (com confirmação)
-   Restaurar o dump selecionado

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

-   API: http://localhost:3334
-   Debug: 9230

## 🛠️ Desenvolvimento

### Problemas Comuns

**Erro "no such file or directory":**

-   No Windows, converta arquivos para LF: `dos2unix scripts/*.sh`
-   Ou use WSL2

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
