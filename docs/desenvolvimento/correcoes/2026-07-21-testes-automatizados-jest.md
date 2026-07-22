# CORR-001 — Suites Jest falham ao carregar (harness desatualizado)

## 1. Identificacao

| Campo | Valor |
|-------|-------|
| Tipo | **fix** |
| Codigo | CORR-001 |
| Titulo | Suites Jest nao carregam: specs/in-memory dessincronizados dos use cases |
| Branch | `fix/testes-automatizados-jest` |
| Severidade | media |
| Ambiente | local (suite `npm test`) |
| Status | verificado |
| Data do incidente | 2026-07-21 (reproducao na suite completa) |
| Data deste documento | 2026-07-21 |
| Relator | desenvolvimento |

## 2. Sintoma (o que o usuario / sistema viu)

Ao rodar `npm test` no `prepara-me-backend`, **18 suites** reportam `FAIL` com `Test suite failed to run`. As **93 assertions que chegam a executar passam**; nenhuma assertion falha por comportamento de negocio — as suites quebradas **nao executam testes**.

- Mensagem de erro / cStat / codigo HTTP (se houver): erros TypeScript do `ts-jest` (`TS2554`, `TS2345`, `TS2724`) na compilacao do arquivo `.spec.ts`
- Onde apareceu (tela, log, job, API): CLI Jest / CI local (`NODE_ENV=test`)
- Frequencia / desde quando: reproducivel na suite completa atual em `master`; nao ligado a falha de runtime de um caso de teste especifico

## 3. Evidencias (fatos)

Comando: `npm test -- --coverage=false` (branch de feature no momento da coleta; mesmas suites existem em `master`).

Resultado agregado:

| Metrica | Valor |
|---------|-------|
| Test Suites | 18 failed, 36 passed, 54 total |
| Tests | 93 passed, 93 total |

| # | Tipo | Evidencia (fato) | Fonte |
|---|------|------------------|-------|
| 1 | sumario Jest | `Test Suites: 18 failed, 36 passed` / `Tests: 93 passed, 93 total` | saida `npm test` |
| 2 | traceback TS | `Expected 2 arguments, but got 1` + `An argument for 'storageProvider' was not provided` ao instanciar `CreateSpecialistUseCase` nos specs | `CreateSpecialistUseCase.spec.ts:13` vs ctor em `CreateSpecialistUseCase.ts` |
| 3 | traceback TS | `ProductsRepositoryInMemory` missing `findBySlug`, `findLassThanPrice`, `findByUserId`, `removeByProductAvailableId`, … | `ListProductUseCase.spec.ts` / `IProductsRepository.ts` vs `ProductsRepositoryInMemory.ts` |
| 4 | traceback TS | import `ICreateUserProductAvailableDTO` de arquivo de Log (`ICreateUserProductAvailableLogDTO`) — membro inexistente | `listUserProductsAvailable` / `createUserProductAvailable` `.spec.ts` |
| 5 | traceback TS | `CreateCompanyEmployeeUseCase` espera 4 deps; spec de remove passa 2 | `RemoveCompanyEmployeeUseCase.spec.ts:19` |
| 6 | traceback TS | schedule use cases esperam 7 args; in-memory de schedule sem `findById` / `findToUser` | specs de schedule + `SpecialistScheduleRepositoryInMemory` |
| 7 | traceback TS | `UpdateUserLaborRiskAlertUseCase` espera `mailProvider`; spec passa 1 arg | `UpdateUserLaborRiskAlertUseCase.spec.ts:32` |
| 8 | traceback TS | `UpdateUserSurveyFields` execute exige `surveyQuestion`; spec omite | `UpdateUserSurveyFieldsUseCase.spec.ts:52` |
| 9 | traceback TS | `SubscriptionPlanProductsRepositoryInMemory` sem `delete` exigido pela interface | `CreateSubscriptionPlanProductUseCase.spec.ts` |
| 10 | codigo | `IProductsRepository` declara metodos ausentes no in-memory; in-memory ainda `implements IProductsRepository` | arquivos sob `src/modules/products/repositories/` |

## 4. Linha do tempo (entendimento fiel)

| Quando | O que ocorreu | Evidencia # |
|--------|---------------|-------------|
| Evolucao do produto (ex.: deps novas em use cases / metodos em interfaces) | Producao ganhou `StorageProvider`, repos extras, campos `onlyAdmin` / `surveyQuestion`, etc. | 2–9 |
| Specs e in-memory nao acompanharam | Continuaram instanciando ctors antigos / stubs incompletos | 2–9 |
| 2026-07-21 | Suite completa: 18 suites falham no *load*; 93 testes executados passam | 1 |

## 5. Impacto

- Quem/o que foi afetado: confianca na suite Jest do backend; CI/local nao sinaliza verde; cobertura efetiva menor (18 suites mortas)
- Dados corrompidos / perda / bloqueio: nao (apenas testes)
- Trabalho interrompido (sim/nao): sim para quem depende de `npm test` como gate

## 6. Causa raiz

### 6.1 Causa raiz (afirmacao)

O harness de teste (arquivos `*.spec.ts` e repositorios `**/in-memory/**`) ficou **desatualizado** em relacao aos construtores, DTOs e interfaces de producao; o `ts-jest` **recusa carregar** essas suites por erro de TypeScript, antes de qualquer `expect`.

### 6.2 Cadeia causal

`evolucao dos use cases/interfaces sem atualizar testes → inconsistencia de tipos no harness → falha de compilacao da suite no Jest → sintoma "18 failed" sem assertion vermelha`

### 6.3 O que **nao** e a causa (descartes)

| Hipotese descartada | Por que descartou (evidencia) |
|---------------------|-------------------------------|
| Regressao da feature de anonimato RH | As 18 suites falhas sao products/specialists/accounts/company; `NPSSurveyAnswersUseCase.spec.ts` passou; falhas sao de *load* TS, nao de assert |
| Falha de logica de negocio nos testes que rodam | `Tests: 93 passed, 93 total` — zero asserts falhos |
| Ambiente Jest / Node quebrado de forma geral | 36 suites PASS; problema concentrado em harness especifico |
| Falta de `StorageProvider` no container DI em runtime de teste | Erro e no `new CreateSpecialistUseCase(...)` manual do spec, nao no container |

### 6.4 Confianca

| Nivel | Condicao |
|-------|----------|
| Alta | Reproduzido ou comprovado por evidencia direta |

Nivel deste caso: **Alta** — reproducao local + mensagens TS apontando arquivo/linha do harness.

## 7. Correcao proposta

### 7.1 Mudanca

Alinhar o harness ao contrato atual de producao, **sem mudar regras de negocio** dos use cases (salvo se um teste revelar bug real — fora do escopo inicial):

1. **In-memory incompletos**: completar metodos faltantes (stubs seguros: `throw` ou retorno vazio/null coerente) em pelo menos:
   - `ProductsRepositoryInMemory`
   - `SpecialistScheduleRepositoryInMemory`
   - `SubscriptionPlanProductsRepositoryInMemory` (`delete`)
2. **Fakes de providers** (ou doubles minimos) para injetar nos specs: `IStorageProvider`, `IMailProvider` onde o ctor exige.
3. **Specs**: passar todas as dependencias do construtor atual; corrigir imports de DTO (`ICreateUserProductAvailableDTO` do arquivo certo); incluir parametros novos nas chamadas `execute` (`onlyAdmin`, `surveyQuestion`, etc.).
4. Suites alvo (18): listadas na secao 3 / sumario Jest.

### 7.2 Justificativa

Elimina a dessincronia que impede o TypeScript de compilar as suites; a suite volta a **executar** os testes e a reportar falhas reais de comportamento, se existirem.

### 7.3 Alternativas consideradas

| Alternativa | Por que nao foi escolhida |
|-------------|---------------------------|
| Desligar type-check do ts-jest / `isolatedModules` so para passar | Mascara o sintoma; suites podem quebrar em runtime com `undefined` |
| Apagar as 18 suites | Perde cobertura; nao recupera o harness |
| Refatorar use cases para menos deps so por causa do teste | Escopo de produto indevido; piggyback |

### 7.4 Riscos da correcao

| Risco | Mitigacao |
|-------|-----------|
| Stubs in-memory incompletos demais geram falsos verdes | Implementar o minimo usado pelos specs; stubs nao usados podem `throw new Error("not implemented")` |
| Specs passam a falhar por assert apos compilar | Tratar como segunda onda (ajustar expectativa ou corrigir bug real), documentar |
| Diff grande em muitos arquivos | Agrupar por familia (products / specialists / accounts) em commits logicos se necessario |

### 7.5 Escopo consciente

- Entra nesta correcao: harness Jest do `prepara-me-backend` (specs + in-memory + fakes de provider); meta `npm test` com 0 suites `failed to run` por TS do harness
- **Nao** entra: mudanca de regra de negocio RH/anonimato; frontend `preparame-platform`; adicao massiva de novos casos de teste alem do necessario para as suites existentes; **`@clamed/logger` e `light-node-metrics`** (gate Node — A-01)

**Assumptions / gate Node**

| ID | Decisao |
|----|---------|
| A-01 | **Nao — nenhum neste MVP.** Fix limitado ao harness Jest (specs, in-memory, fakes). Sem `@clamed/logger` nem `light-node-metrics`. |

## 8. Plano de verificacao (V-xx)

| ID | Como validar | Resultado esperado |
|----|--------------|-------------------|
| V-01 | `npm test -- --coverage=false` | 0 suites com `Test suite failed to run` por erro TS do harness; suites antes falhas passam a executar |
| V-02 | Re-rodar um amostra por familia (`CreateSpecialist`, `ListProduct`, `CreateUserProductAvailable`) | Suites carregam; asserts coerentes com comportamento atual |
| V-03 | Regressao: suites que ja PASSavam (ex. `AuthenticateUser`, `CreateCompany`) | Continuam PASS |

## 9. Apos a correcao (preencher nas fases de teste / docs)

| Campo | Valor |
|-------|-------|
| Commit(s) | `ce3c829` |
| O que mudou de fato | Harness: StorageProviderInMemory; Products/Schedule/SubscriptionPlanProducts in-memory; 18 specs alinhados; `coverage` no `.gitignore` |
| Verificacoes executadas (V-xx) | V-01: `npm test -- --coverage=false` → **53 passed / 129 tests passed** |
| Status final | verificado |

## 10. Licoes / prevencao (opcional)

- Ao alterar ctor/`@inject` ou interface de repositorio, atualizar o `*.spec.ts` e o `*InMemory` no mesmo PR.
- Opcional: job CI que falhe se `Test suite failed to run` > 0.

---

## Checklist de validacao (pre-aprovacao)

| Item | Resultado |
|------|-----------|
| A0 Tipo fix + modelo-fix + branch `fix/...` | PASS |
| A Evidencias + sintoma sem misturar causa + descartes | PASS |
| B Causa raiz + cadeia + confianca Alta | PASS |
| C Correcao / justificativa / alternativas / fora de escopo | PASS |
| D V-xx | PASS |
| Gate Node (A-01) decidido: Nao | PASS |

```text
Validacao: PASS
Pode seguir para arquitetura?: Sim (apos aprovacao humana do entendimento)
```
