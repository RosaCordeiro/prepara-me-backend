# Preparame API

API backend para o sistema Preparame desenvolvida com Node.js, TypeScript e PostgreSQL.

## Banco de dados (PostgreSQL no WSL)

O PostgreSQL roda **localmente no WSL** (sem Docker), em `~/.local/pgsql/data`.

### Setup inicial

```bash
./scripts/setup-wsl-postgres.sh
```

Isso instala os binários, cria o banco `preparame` e atualiza o `.env`.

### Subir o PostgreSQL

```bash
./scripts/start-postgres.sh
```

### Restaurar dump

```bash
./dumps/restore-dump.sh "/caminho/para/backup.sql"
```

Script de criação do banco (reutilizável): `scripts/create-database.sql`

Conexões:
- **WSL / Node local:** `localhost:5432` (Postgres WSL) ou `localhost:5435` (Postgres no Compose)
- **App no Docker Compose:** host `database`, porta `5432` (serviço `database` na rede `preparame`)

## 🚀 Início Rápido

### Pré-requisitos

-   Docker no WSL (usuário no grupo `docker`)
-   Node.js no WSL (para o frontend)

### Como executar

```bash
# Backend + Postgres (Docker)
cd prepara-me-backend
docker compose up --build -d

# Frontend (WSL)
cd ../preparame-platform
npm run dev
```

API: http://localhost:3334 · Frontend: http://localhost:8080

Logs da API: `docker compose logs -f app`

### Anonimato (relatórios RH)

Variável no `.env.exemple` (opcional no `.env`; default **5** no código):

```bash
SURVEY_ANONYMITY_MIN_RESPONDENTS=5
```

Para `COMPANY_ADMIN`, se o filtro tiver ≤ esse número de respondentes com pesquisa respondida:
- a API retorna `insufficientSample: true`
- métricas do filtro vêm como **`Sem informações`** (não usa mais `N/A` / `lessThanFive`)
- respostas qualitativas do filtro vêm vazias

`ADMIN` da plataforma não está sujeito ao limiar neste MVP. Reinicie a API após alterar a env.

Endpoint (inalterado): `GET` reports `/npsSurveyAnswers`.

### Testes (anonimato)

```bash
npm test -- --testPathPattern=NPSSurveyAnswersUseCase.spec --coverage=false
```

Spec/design: [`docs/desenvolvimento/especificacoes/2026-07-21-rh-anonimato-limite-amostra.md`](docs/desenvolvimento/especificacoes/2026-07-21-rh-anonimato-limite-amostra.md).

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
