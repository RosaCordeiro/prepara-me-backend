# Acesso local — Prepara.me (desenvolvimento)

Referência rápida para ambiente local no WSL. **Não usar em produção.**

---

## URLs

| Serviço | URL |
|---|---|
| Frontend (plataforma) | http://localhost:8080 |
| API (backend) | http://localhost:3334 |
| Login | http://localhost:8080/#/login |

---

## Banco PostgreSQL

### Opção A — Postgres no Docker (Compose atual)

| Campo | Valor |
|---|---|
| Host (app no Compose) | `database` |
| Host (DBeaver / host) | `localhost` |
| Porta (host) | `5435` |
| Porta (rede Docker) | `5432` |
| Database | `preparame` |
| Usuário | `docker` |
| Senha | `admin@01` |

### Opção B — Postgres local WSL

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Porta | `5432` |
| Database | `preparame` |
| Usuário (backend / DBeaver) | `docker` |
| Senha | `admin@01` |

Alternativa (dono das tabelas do dump): `usprepareme` / `admin@01`

---

## Usuários de teste da plataforma

**Senha de login de todos:** `Teste@123`

| Perfil | E-mail | Nome | Observação |
|---|---|---|---|
| ADMIN | `teste.admin@prepara.me` | Admin Teste | Administração da plataforma |
| SPECIALIST | `teste.especialista@prepara.me` | Especialista Teste | Perfil especialista |
| COMPANY_ADMIN | `teste.empresa@prepara.me` | Admin Empresa Teste | RH — layout novo / dashboard empresa |
| USER | `teste.colaborador1@prepara.me` | Colaborador Teste 1 | Operações · Matriz SP · NPS 9 · recolocado |
| USER | `teste.colaborador2@prepara.me` | Colaborador Teste 2 | RH · Matriz SP · NPS 6 · alerta risco |
| USER | `teste.colaborador3@prepara.me` | Colaborador Teste 3 | Financeiro · Filial SP · NPS 3 · alerta risco |
| USER | `teste.colaborador4@prepara.me` | Maria Silva Costa | Tecnologia · Matriz SP · NPS 10 · recolocado |
| USER | `teste.colaborador5@prepara.me` | João Pedro Santos | Comercial · Filial RJ · NPS 2 · PCD · alerta |
| USER | `teste.colaborador6@prepara.me` | Ana Beatriz Lima | Marketing · Matriz SP · NPS 7 |
| USER | `teste.colaborador7@prepara.me` | Pedro Henrique Oliveira | Logística · CD Campinas · NPS 8 · recolocado |
| USER | `teste.colaborador8@prepara.me` | Fernanda Souza Mendes | Jurídico · Matriz SP · NPS 5 · alerta risco |
| USER | `teste.colaborador9@prepara.me` | Carlos Eduardo Rocha | Produção · Filial MG · **sem pesquisa** · PCD |
| USER | `teste.colaborador10@prepara.me` | Juliana Aparecida Ferreira | Customer Success · Filial NE · NPS 8 |

### Empresa de teste

| Campo | Valor |
|---|---|
| Nome | Empresa Teste Prepara.me |
| Token assinatura | `TESTE-PREPARA-2026` |
| Colaboradores ativos | 10 (9 com pesquisa respondida) |
| Colaborador pendente | 1 (`teste.pendente@prepara.me`, sem login) |
| Áreas no seed | Operações, RH, Financeiro, Tecnologia, Comercial, Marketing, Logística, Jurídico, Produção, Customer Success |
| Unidades no seed | Matriz SP, Filial SP, Filial RJ, CD Campinas, Filial MG, Filial NE |
| Perguntas qualitativas | 2 perguntas da empresa + respostas nos colaboradores com pesquisa |

### Colaborador pendente (sem login)

| E-mail | Situação |
|---|---|
| `teste.pendente@prepara.me` | Cadastrado na empresa, ainda **não aceitou** convite (sem usuário USER) |

---

## Recriar usuários de teste

Se os usuários sumirem após restore do banco:

```bash
cd prepara-me-backend
node scripts/build-seed-test-users.js   # opcional: regenera o SQL
bash scripts/seed-test-users.sh
```

Script SQL: `scripts/seed-test-users.sql` (gerado por `scripts/build-seed-test-users.js`)
Perfis de pesquisa: `scripts/seed-test-company-profiles.js`

---

## Subir o ambiente

### Backend + Postgres (Docker Compose) — recomendado

```bash
cd prepara-me-backend
# .env: DB_HOST=database e DB_PORT=5432 (o compose também força isso no serviço app)
docker compose up --build -d
docker compose logs -f app   # até "Server is running on 3334!"
```

API: http://localhost:3334

### Frontend (:8080)

```bash
cd preparame-platform
npm run dev
```

### Alternativa — API no host (sem container app)

```bash
# Postgres: Docker na 5435 OU scripts/start-postgres.sh na 5432
# .env: DB_HOST=localhost e DB_PORT conforme a opção
cd prepara-me-backend
npm run dev
```
