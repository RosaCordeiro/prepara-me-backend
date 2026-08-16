# CORR — Importação Admin: erro UUID "null" e dash não atualiza

## 1. Identificacao

| Campo | Valor |
|-------|-------|
| Tipo | **fix** |
| Codigo | CORR-ADMIN-IMP-001 |
| Titulo | Importar pesquisa: Internal server error uuid "null" + toast de sucesso + dash sem refletir |
| Branch | `fix/admin-import-survey-uuid-null` (platform `main` + backend `master`) |
| Severidade | **alta** |
| Ambiente | prod / homolog (Admin) |
| Status | matriz RN preenchida (2026-08-16) — auto em andamento |
| Data do incidente | 2026-08-16 (relato) |
| Data deste documento | 2026-08-16 |
| Relator | Prepara.me / Admin |

## 2. Sintoma (o que o usuario / sistema viu)

Ao importar pesquisa no Admin:

1. Aparece mensagem de que os dados foram **importados com sucesso**
2. Aparece também **Internal server error - invalid input syntax for type uuid: "null"**
3. Dados **não refletem** no dashboard RH/Admin após a importação

## 6. Causa raiz (resumo)

Refresh pós-import força `companyId` nulo → `GET companies/config/null` → Postgres UUID 500. Toast de sucesso vem do HTTP 200 do import, independente do refresh.

## 7. Correcao (implementada)

- Front: sem `selectedCompany=null`; toast/refresh só se `success > 0`; `hasValidCompanyId`
- Back: `GetCompanyParametersUseCase` rejeita `"null"` / `"undefined"` / vazio com **400** antes do `findById`

## 8. Plano de verificacao (V-xx)

| ID | Como validar | Resultado esperado |
|----|--------------|-------------------|
| V-01 | Importar planilha válida com empresa selecionada | Sem erro UUID; dash atualiza |
| V-02 | Import com `success: 0` | Sem toast sucesso enganoso; sem refresh forçado |
| V-03 | Carregar dash / trocar empresa sem path `/config/null` | Guard impede request com id inválido |
| V-04 | `GET /companies/config/null` (e equivalentes inválidos) | **400** `Invalid id` (não 500 UUID) |
| V-05 | Agregados `TUDO`/`B2B`/`B2C` no use case | Seguem sem `findById`; chamam `getParameters` |
| V-06 | UUID inexistente no use case | `Company not found` (AppError); não confunde com Invalid id |

## Matriz de verificacao (fase teste-regra-negocio)

Executada em 2026-08-16 contra API local `:3334` + leitura do código/Jest.

| ID | RN/causa | Dado | Quando | Entao (observaveis) | Alvo backend | Resultado | Evidencia | Spec sugerido | Acao auto |
|----|----------|------|--------|---------------------|--------------|-----------|-----------|---------------|-----------|
| V-01 | Refresh pós-import + dash | Admin com empresa; planilha válida | Importa Excel com sucesso | Dash atualiza sem toast dual UUID | — (UI Admin) | BLOQUEADO | Schema local incompleto (login/companies) | — | debito (front fora do escopo auto) |
| V-02 | Toast enganoso `success:0` | Resposta import `{ success:0, errors:[...] }` | UI processa resultado | Sem notify positive; sem refresh | — (UI) | PASS* | Código `resolveImportOutcome` + unit front (fora escopo auto backend) | — | debito (front fora do escopo auto) |
| V-03 | Guard companyId / sem `/config/null` | `companyId` null/`"null"` | `loadParameters` / load dash | Não chama `companies/config/null` | — (UI) | PASS* | `hasValidCompanyId` no util front | — | debito (front fora do escopo auto) |
| V-04 | Causa raiz UUID `"null"` | Token válido; id path `null` / `undefined` / espaço | `GET /companies/config/:id` | status **400**; body `{"message":"Invalid id"}`; **não** 500 uuid; use case **não** chama `findById` nem `getParameters` | `GetCompanyParametersUseCase` + rota config | PASS | HTTP 400; Jest `V-04:*` (5 its) | `.../GetCompanyParametersUseCase.spec.ts` | ja-cobre |
| V-05 | Regressão agregados | id `TUDO` / `B2B` / `B2C` | `execute(id)` | `findById` **não** chamado; `getParameters` chamado com o id | `GetCompanyParametersUseCase` | PASS (unit) / BLOQUEADO (HTTP schema) | Jest `V-05:*` (3 its). HTTP 500 linkedinUrl = schema local | mesmo spec | ja-cobre |
| V-06 | Distinguir not found vs invalid | id UUID válido inexistente / existente | `execute(id)` | not found vs getParameters | `GetCompanyParametersUseCase` | PASS | Jest `V-06:*` (2 its) | mesmo spec | ja-cobre |

\* PASS* = comportamento conferido no código da entrega; validação E2E UI não rodada neste ambiente.

### Resumo fase RN

| Metrica | Valor |
|---------|-------|
| PASS / PASS* | V-02*, V-03*, V-04, V-05 (unit) |
| BLOQUEADO | V-01 (UI/schema); V-05 HTTP (schema) |
| debito front | V-01, V-02, V-03 |
| Acao auto backend | V-04/V-05/V-06 **ja-cobre** (10 its) |

## 9. Apos a correcao

| Campo | Valor |
|-------|-------|
| Commit(s) | platform `6ebea09`; backend `dc6bac3` (fix); skills em branch separada |
| O que mudou de fato | Harden config + front refresh/toast |
| Verificacoes (V-xx) | Matriz acima |
| Status final | matriz RN ok — seguir auto |

## Validacao

```text
Validacao matriz: PASS (colunas preenchidas; debitos front explicitos)
Pode seguir para testes automatizados?: Sim (pedido do usuario: rodar RN + auto)
```
