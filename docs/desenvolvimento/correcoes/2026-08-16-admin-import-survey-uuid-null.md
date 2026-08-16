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
| Status | **documentado / verificado (automatizado)** |
| Data do incidente | 2026-08-16 (relato) |
| Data deste documento | 2026-08-16 |
| Relator | Prepara.me / Admin |

## 2. Sintoma (o que o usuario / sistema viu)

Ao importar pesquisa no Admin:

1. Aparece mensagem de que os dados foram **importados com sucesso**
2. Aparece também **Internal server error - invalid input syntax for type uuid: "null"**
3. Dados **não refletem** no dashboard RH/Admin após a importação

- Mensagem de erro: `Internal server error - invalid input syntax for type uuid: "null"`
- Onde: Admin → importação NPS / pesquisa; chamada subsequente ao dash
- Frequencia: a cada importação que dispara `refreshDashboard`

## 3. Evidencias (fatos)

| # | Tipo | Evidencia (fato) | Fonte |
|---|------|------------------|-------|
| 1 | codigo | `refreshDashboard` zera `selectedCompany = null` e depois restaura — força remount/watch | `HomeAdmin.vue` (antes do fix) |
| 2 | codigo | `loadParameters` chama `companies/config/${this.companyId}` sem guard de `!companyId` | `DashBoardAnswers.vue` |
| 3 | codigo | Guard só trata string `"null"`, não JS `null` (`null !== "null"`) | `DashBoardAnswers.vue` |
| 4 | codigo | Backend `GetCompanyParametersUseCase`: string `"null"` é truthy → `findById("null")` → erro UUID Postgres | `GetCompanyParametersUseCase.ts` |
| 5 | codigo | `processImport` sempre notifica sucesso positivo e chama `refreshDashboard` se `response.ok` (HTTP 200), mesmo com `success: 0` + errors | `HomeAdmin.vue` |
| 6 | codigo | Import batch retorna 200 com body `{ success, errors }`; validação de linhas não vira 4xx | Import batch |
| 7 | teste local | `companyId = null` → URL `companies/config/null` | script + código |
| 8 | HTTP pós-fix | `GET /companies/config/null` → **400** `Invalid id` | API :3334 |
| 9 | unit | Platform `npm test` (6) + backend `GetCompanyParametersUseCase.spec` (6) | jest / node:test |

## 4. Linha do tempo (entendimento fiel)

| Quando | O que ocorreu | Evidencia # |
|--------|---------------|-------------|
| 1 | Admin envia Excel; API importa (ou retorna 200 com resumo) | 5, 6 |
| 2 | UI mostra toast/dialog de sucesso | 5 |
| 3 | `refreshDashboard` seta `selectedCompany = null` | 1 |
| 4 | Dash chama `GET .../companies/config/null` | 2, 3 |
| 5 | Postgres rejeita UUID `"null"` → 500 Internal server error | 4 |
| 6 | Refresh falha / UI fica stale → dash não reflete | 1–4 |

## 5. Impacto

- Quem: Admin importando pesquisa; RH vendo dash
- Dados: import pode ter **persistido** no banco enquanto a UI falha no refresh (ou import com `success: 0` ainda mostra “concluída”)
- Trabalho interrompido: sim — confiança na importação e na visão do dash

## 6. Causa raiz

### 6.1 Causa raiz (afirmacao)

O refresh pós-importação força `companyId` nulo, o front chama a API com o path literal `"null"`, e o backend tenta usar isso como UUID — gerando 500. O toast de sucesso é da importação HTTP 200, independente do refresh.

### 6.2 Cadeia causal

`import OK (200) → toast sucesso → refreshDashboard(null) → GET config/null → UUID inválido → 500 → dash não atualiza`

### 6.3 O que **nao** e a causa (descartes)

| Hipotese descartada | Por que descartou |
|---------------------|-------------------|
| Import sempre falha no Excel e “mente” sucesso | Dual toast: sucesso da import + erro do refresh; padrão bate com `refreshDashboard` |
| Só bug de Postgres no insert do import | Erro `"null"` como UUID casa com path `/config/null`, não com coluna tipicamente preenchida no batch |

### 6.4 Confianca

**Alta** — evidência direta no código do refresh + endpoint + testes.

## 7. Correcao proposta (implementada)

### 7.1 Mudanca

**Platform**

1. `refreshDashboard`: sem hack `selectedCompany = null`; `dashboardKey++` + `loadNpsSurveyAnswers()`.
2. `hasValidCompanyId` via `src/utils/adminImportDashboard.js` antes de `loadParameters` / load do dash.
3. `processImport`: `resolveImportOutcome` — toast positivo + refresh só se `success > 0`.

**Backend**

4. `GetCompanyParametersUseCase`: rejeita id inválido / `"null"` / `"undefined"` com 400 antes do `findById`.

### 7.2 Justificativa

Elimina o gatilho do 500 e alinha feedback de UI ao resultado real da importação.

### 7.5 Escopo

- Entra: refresh Admin + guards front + harden UUID + feedback de import + testes
- Não entra: refactor do import batch; `@clamed/logger` / `light-node-metrics`

### Premissas

| ID | Premissa |
|----|----------|
| A-01 | Gate Node: **não** incluir `@clamed/logger` nem `light-node-metrics` |
| A-02 | Sintoma dual (sucesso + 500) é refresh, não necessariamente falha total do Excel |

## 8. Plano de verificacao (V-xx)

| ID | Como validar | Resultado |
|----|--------------|-----------|
| V-01 | Importar planilha válida com empresa selecionada | Manual / schema local incompleto — pendente UI |
| V-02 | Import com `success: 0` | **PASS** (unit `resolveImportOutcome`) |
| V-03 | Trocar empresa / carregar dash sem `/config/null` | **PASS** (unit `hasValidCompanyId` + política refresh) |
| V-04 | Backend `GET /companies/config/null` | **PASS** — 400 HTTP + Jest |

## 9. Apos a correcao

| Campo | Valor |
|-------|-------|
| Commit(s) | pendente (DoD / pedido explícito) |
| O que mudou de fato | Front: util + HomeAdmin/DashBoardAnswers. Back: GetCompanyParameters 400 + spec. Docs README/CHANGELOG. |
| Verificacoes (V-xx) | V-02/V-03/V-04 PASS automatizado; V-01 manual pendente |
| Status final | documentado |

## Validacao

| Item | Resultado |
|------|-----------|
| A0 fix + branches | PASS |
| A–D evidência/causa/V | PASS |
| Gate Node A-01 | PASS |

```text
Validacao: PASS
Desvio: implementacao a pedido explicito ("ja arruma") sem AskQuestion de arquitetura.
```
