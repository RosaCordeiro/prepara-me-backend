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
| USER | `teste.colaborador1@prepara.me` | Colaborador Teste 1 | Ex-colaborador (empresa teste) |
| USER | `teste.colaborador2@prepara.me` | Colaborador Teste 2 | Ex-colaborador (empresa teste) |
| USER | `teste.colaborador3@prepara.me` | Colaborador Teste 3 | Ex-colaborador (empresa teste) |

### Empresa de teste

| Campo | Valor |
|---|---|
| Nome | Empresa Teste Prepara.me |
| Token assinatura | `TESTE-PREPARA-2026` |

### Colaborador pendente (sem login)

| E-mail | Situação |
|---|---|
| `teste.pendente@prepara.me` | Cadastrado na empresa, ainda **não aceitou** convite (sem usuário USER) |

---

## Recriar usuários de teste

Se os usuários sumirem após restore do banco:

```bash
cd prepara-me-backend
bash scripts/seed-test-users.sh
```

Script SQL: `scripts/seed-test-users.sql`

---

## Subir o ambiente

```bash
# Backend (API :3334) — na pasta prepara-me-backend
npm run dev

# Frontend (:8080) — na pasta preparame-platform
npm run dev
```

PostgreSQL local deve estar ativo (`scripts/start-postgres.sh`).
