# CORR — Edição de Funcionário duplica mentorias

## 1. Identificacao

| Campo | Valor |
|-------|-------|
| Tipo | **fix** |
| Codigo | CORR-EMP-MENT-001 |
| Titulo | Edição de Funcionário duplica créditos de mentoria (`userProductsAvailable`) |
| Branch | `fix/employee-update-duplica-mentorias` (backend `master`; platform N/A neste MVP) |
| Severidade | **alta** |
| Ambiente | prod / homolog (comportamento de código; independente de ambiente) |
| Status | verificado |
| Data do incidente | 2026-08-16 (relato) |
| Data deste documento | 2026-08-16 |
| Relator | Prepara.me / RH |

## 2. Sintoma (o que o usuario / sistema viu)

Toda vez que o RH altera alguma informação em **Funcionário** e salva, as **mentorias** daquele usuário (créditos disponíveis) **aumentam / duplicam**, mesmo sem mudança de plano.

- Mensagem de erro / cStat / codigo HTTP (se houver): N/A — operação de save conclui com sucesso; o efeito colateral é nos créditos
- Onde apareceu (tela, log, job, API): cadastro/edição de Funcionário (CRUD RH) → créditos de mentoria do ex-colaborador (home / produtos disponíveis)
- Frequencia / desde quando: a cada save de edição que envia `planId`; introduzido no fluxo unificado create/update de funcionário

## 3. Evidencias (fatos)

| # | Tipo | Evidencia (fato) | Fonte |
|---|------|------------------|-------|
| 1 | codigo | Em update (`id` presente), se `plan !== undefined`, o use case **sempre** faz `userProductsAvailableRepository.create` para cada produto do plano — sem checar se o plano mudou nem se créditos já existem | `CreateCompanyEmployeeUseCase.ts` ~206–227 |
| 2 | codigo | `UserProductsAvailableRepository.create` é **insert** puro (sem upsert / unicidade user+product) | `UserProductsAvailableRepository.ts` ~21–36 |
| 3 | codigo | Front de edição **sempre** remapeia `plan` → `planId` e envia no POST, mesmo com plano somente leitura na UI | `CompanyEmployeesRegisterCrud.vue` ~447–464 |
| 4 | codigo | Home do usuário **soma** `availableQuantity` de linhas duplicadas do mesmo produto → mentoria “duplicada” na UI | `HomeUser.vue` `unirProdutos` ~262–274 |
| 5 | rota | Create e update compartilham `POST /companies/:id/employees` | `companies.routes.ts` ~113–117 |

## 4. Linha do tempo (entendimento fiel)

| Quando | O que ocorreu | Evidencia # |
|--------|---------------|-------------|
| 1 | Funcionário já possui `userId` e créditos de mentoria do plano | 1, 4 |
| 2 | RH abre edição, altera qualquer campo (ou só salva) | relato |
| 3 | Front envia POST com `id` + `planId` | 3 |
| 4 | Backend resolve o plano e **insere novo conjunto** de `userProductsAvailable` | 1, 2 |
| 5 | UI do usuário soma quantidades → mentoria aparece duplicada | 4 |

## 5. Impacto

- Quem/o que foi afetado: ex-colaboradores/usuários com plano + créditos; RH que edita ficha
- Dados corrompidos / perda / bloqueio: **inflação de créditos** de mentoria (linhas extras em `userProductsAvailable`); não apaga histórico, mas concede saldo indevido
- Trabalho interrompido (sim/nao): sim — operação de RH gera efeito colateral financeiro/operacional de agendamento

## 6. Causa raiz

### 6.1 Causa raiz (afirmacao)

No update de `CompanyEmployee`, o backend **recria créditos do plano** sempre que `planId` vem no payload, sem idempotência nem checagem de “plano realmente alterado”.

### 6.2 Cadeia causal

`save de Funcionário com planId → CreateCompanyEmployeeUseCase update cria novos userProductsAvailable → Home soma quantidades → mentoria duplicada`

### 6.3 O que **nao** e a causa (descartes)

| Hipotese descartada | Por que descartou (evidencia) |
|---------------------|-------------------------------|
| Cascade/hook TypeORM em `CompanyEmployee` recria mentoring | Update no repositório só persiste campos do employee; side-effect está só no use case |
| `CreateMentoringUseCase` (mentoria coletiva) no save do funcionário | Fluxo separado; não é chamado no update de employee |
| Bug só no front “duplicando” visual | Front soma linhas reais; o insert acontece no backend (ev. 1–2) |

### 6.4 Confianca

| Nivel | Condicao |
|-------|----------|
| Alta | Reproduzido ou comprovado por evidencia direta |

Nivel deste caso: **Alta** — evidência direta no código do caminho de update.

## 7. Correcao proposta

### 7.1 Mudanca

Em `CreateCompanyEmployeeUseCase` (ramo update):

- Conceder produtos do plano **somente** quando o plano **efetivamente mudar** (comparar plano resolvido vs `existingEmployee.plan`), **ou** quando o usuário ainda não tiver créditos daqueles produtos (estratégia a fechar no design).
- Preferência MVP: **não recriar créditos se o plano não mudou**; se mudou, definir regra explícita (substituir vs conceder delta) no design.
- Opcional (fora do MVP backend-only): front omitir `planId` se inalterado — defesa em profundidade.

Arquivo principal: `src/modules/company/useCases/createCompanyEmployee/CreateCompanyEmployeeUseCase.ts`.

### 7.2 Justificativa

Elimina o gatilho que cria linhas novas a cada save; ataca a causa (insert incondicional), não só a soma na UI.

### 7.3 Alternativas consideradas

| Alternativa | Por que nao foi escolhida |
|-------------|---------------------------|
| Só omitir `planId` no front | Backend continuaria vulnerável a qualquer cliente que envie `planId` |
| Soft-delete / job de limpeza das duplicatas sem mudar update | Trata sintoma histórico; não impede novas duplicações |
| UNIQUE (userId, productId) + upsert cego | Pode mascarar mudança intencional de plano; precisa regra de negócio no design |

### 7.4 Riscos da correcao

| Risco | Mitigacao |
|-------|-----------|
| RH muda o plano esperando novos créditos e não recebe | Design deve definir comportamento em **troca de plano** |
| Dados já duplicados em produção | Escopo separado: script/rotina de saneamento (não misturar no MVP do fix de insert) |

### 7.5 Escopo consciente

- Entra nesta correcao: parar duplicação em updates futuros no backend (`CreateCompanyEmployeeUseCase` update)
- **Nao** entra: UI ampla OTW/RH; limpeza massiva de dados históricos; `@clamed/logger` / `light-node-metrics`; refactor geral do CRUD de employee

### Fora de escopo (observabilidade)

- Não adicionar `@clamed/logger` nem `light-node-metrics` neste fix — apenas corrigir o ponto encontrado.

### Premissas / Assumptions

| ID | Premissa |
|----|----------|
| A-01 | Stack Node (API) — **não** incluir `@clamed/logger` nem `light-node-metrics` neste MVP (gate 2026-08-16: opção 4) |
| A-02 | “Mentoria duplicada” = créditos `userProductsAvailable` somados na home (não necessariamente linhas em tabela `mentoring`) |
| A-03 | Front continua podendo enviar `planId` no edit; o backend deve ser idempotente quanto a créditos |

## 8. Plano de verificacao (V-xx)

| ID | Como validar | Resultado esperado | Resultado (fase 5) |
|----|--------------|-------------------|--------------------|
| V-01 | Funcionário com plano e créditos; editar outro campo e salvar **sem** mudar plano | Sem novos `userProductsAvailable` | **PASS** — guard `planChanged === false` quando nomes iguais (incl. trim); evidência lógica + código update |
| V-02 | Criar funcionário novo com plano (fluxo create) | Créditos criados **uma** vez | **PASS** — ramo create (`!id`) inalterado (`~343–352`); loop de produtos só no create |
| V-03 | Alterar plano A→B e salvar | Concede produtos do novo plano (1×) | **PASS** — `planChanged === true` libera o create; empilhar créditos do plano novo aceito no design MVP |
| V-04 | Update de campos sem mudança efetiva de plano / plano resolvido igual | Employee atualiza; sem insert de produtos | **PASS** — mesma condição de V-01; update de campos fora de `plan` não entra no bloco de concessão |

### Suite automatizada (fase 6 — 2026-08-16)

- Comando: `npm test` (jest --runInBand)
- Resultado: **53** suites PASS / **132** tests PASS (exit 0)
- Nota: aviso EACCES ao gravar HTML de coverage em pasta legado (`createUserProductAvailable copy`); não falhou a suite
- Escopo: só backend nesta entrega (platform N/A)

### Cobertura do fix (pós-DoD — 2026-08-16)

Casos adicionados em `CreateCompanyEmployeeUseCase.spec.ts` (+ `findById` no in-memory):

| Caso | Resultado |
|------|-----------|
| Update com mesmo plano → não recria créditos | PASS |
| Update com plano diferente → concede créditos do novo | PASS |
| Update com plano novo sem `userId` → não concede | PASS |
| Update sem `plan` no body → atualiza ficha, não mexe em créditos | PASS |

Comando: `npm test -- --testPathPattern=CreateCompanyEmployeeUseCase.spec --coverage=false` → **8** tests PASS.

## 9. Apos a correcao (preencher nas fases de teste / docs)

| Campo | Valor |
|-------|-------|
| Commit(s) | (a gravar apos commit) |
| O que mudou de fato | Guard no update: não recria `userProductsAvailable` se o nome do plano não mudou |
| Verificacoes executadas (V-xx) | V-01 PASS; V-02 PASS; V-03 PASS; V-04 PASS |
| Status final | verificado (suite 53/132 PASS; docs atualizados; commit/push na fase DoD) |

## 10. Licoes / prevencao (opcional)

- Side-effects de concessão de produto no update devem ser condicionados a mudança real de plano
- Considerar teste automatizado cobrindo “update sem mudança de plano não cria `userProductsAvailable`”

---

## Validacao (checklist)

| Item | Resultado |
|------|-----------|
| A0 Tipo fix + branch | PASS — `fix/employee-update-duplica-mentorias` |
| A Fidelidade / evidencias | PASS |
| B Causa raiz | PASS — confiança Alta |
| C Justificativa | PASS |
| D V-xx | PASS |
| Gate Node A-01 | PASS — nenhum pacote neste MVP |

```text
Validacao: PASS
Pode seguir para arquitetura?: Sim (apos aprovacao humana do entendimento)
```
