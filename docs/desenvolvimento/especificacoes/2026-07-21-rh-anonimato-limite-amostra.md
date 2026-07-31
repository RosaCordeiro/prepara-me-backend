# SPEC — Anonimato RH: limiar mínimo de respondentes no filtro

## 1. Identificacao do documento

| Campo | Valor |
|-------|-------|
| Tipo | **feat** |
| Titulo | Limiar configurável de anonimato para consultas RH (Painel / quantitativa / qualitativa) |
| Codigo / versao | SPEC-2026-07-21-rh-anonimato-limite-amostra / v0.1 |
| Branch | `feat/rh-anonimato-limite-amostra` (`prepara-me-backend` + `preparame-platform` — rename do contrato + UI) |
| Objetivo (1-2 frases) | Impedir que o COMPANY_ADMIN veja métricas/respostas de um filtro com amostra ≤ X (default 5, env), preservando anonimato; substituir o flag legado `lessThanFive` por nome neutro ao limiar. |
| Solicitante / stakeholders | Produto / compliance / RH Prepara.me |
| Atores / personas | COMPANY_ADMIN (sujeito à regra); ADMIN (fora do limiar neste MVP); USER N/A |
| Prioridade | MVP |
| Status | **verificado** |
| Data | 2026-07-21 |

## 2. Contexto e problema (BRD)

- **Situacao atual:** o relatório de pesquisa (`NPSSurveyAnswersUseCase`) usa o flag legado **`lessThanFive`** (nome amarrado ao número 5) e devolve `N/A` em várias métricas quando a amostra é pequena, **mas** `COMPANY_ADMIN` e `ADMIN` **bypassam** o limite. Assim o RH vê indicadores com poucos respondentes — risco de reidentificação. O nome `lessThanFive` deixa de fazer sentido com limiar configurável.
- **Dor:** anonimato comprometido nas telas de consulta do RH (Painel, Pesquisa quantitativa, Pesquisa qualitativa).
- **Por que agora:** privacidade nos filtros do dashboard RH + limpar contrato legado.
- **Restricoes:** enforcement no **backend**; limiar via **env**; critério **≤ X**; default **5**; **renomear** o flag no contrato API e no frontend (breaking controlado nesta entrega: backend + platform juntos).

## 3. Objetivos e metrica de sucesso

| Objetivo | Como medir (negocio) |
|----------|----------------------|
| RH não vê dados do filtro com amostra ≤ X | Com filtro que deixa ≤ X respondentes com pesquisa respondida, API marca insuficiência e não devolve métricas/respostas utilizáveis desse filtro |
| Limiar configurável | Alterar env e reiniciar API muda o X sem deploy de código |
| Contrato sem “Five” fixo | API/front usam flag com nome neutro (ex.: `insufficientSample`); `lessThanFive` removido do contrato desta entrega |
| ADMIN continua operacional | ADMIN da plataforma não é bloqueado pelo limiar neste MVP |

## 4. Escopo

### 4.1 Em escopo

- Aplicar limiar de anonimato ao perfil **COMPANY_ADMIN** no relatório usado por:
  - Painel de riscos e impactos
  - Pesquisa quantitativa
  - Pesquisa qualitativa
- Contagem: respondentes do resultado filtrado com pesquisa respondida (`surveyAnswered`), comparada com **≤ X**.
- Env no backend, ex.: `SURVEY_ANONYMITY_MIN_RESPONDENTS` (nome final na arquitetura), **default 5** se ausente/inválido.
- Quando insuficiente: flag **`insufficientSample: true`** e métricas do filtro com valor **`Sem informações`** (nunca `N/A`, para não distinguir “vazio” de “omitido”).
- **Renomear** em backend + `preparame-platform`: eliminar `lessThanFive` do JSON e do código das telas RH (e props internas derivadas, preferindo `insufficient` / `insufficientSample`).
- Comparativo multi-filtro: cada conjunto de filtros = uma chamada; cada um respeita o limiar.
- Atualizar testes/scripts que esperam bypass de COMPANY_ADMIN ou o campo antigo.
- Documentar a env no `.env.exemple` / README do backend.

### 4.2 Fora de escopo

- Aplicar limiar a **ADMIN** (plataforma) neste MVP.
- Configuração por empresa (UI/cadastro) — só env global.
- Novas telas de consulta fora das três citadas.
- Alterar fórmula das métricas quando a amostra é suficiente.
- Remoção das exception companies hardcoded (avaliar na arquitetura; não expandir lista).
- Compatibilidade eterna com o campo `lessThanFive` (sem alias legado neste MVP — front e API sobem juntos).
- `@clamed/logger` / `light-node-metrics` — **Não** neste MVP.

### 4.3 Premissas e dependencias

- **A-01:** As três telas RH usam o mesmo endpoint/use case de relatório NPS; correção no backend cobre as três.
- **A-02:** “Não retornar dados do filtro específico” = não expor métricas/respostas **daquele** subset; `general` pode permanecer se não vazar o subset (arquitetura).
- **A-03:** Critério **≤ X**.
- **A-04:** Contagem com `surveyAnswered` no resultado filtrado.
- **A-06:** Nome canônico do flag = **`insufficientSample`** (boolean). Métodos internos (`shouldCheckSurveyLimit`, etc.) podem ser alinhados na arquitetura (ex.: `isSampleBelowAnonymityThreshold`).
- **Dependencias:** deploy coordenado backend + platform.
- **Gate Node:** **Não** — nenhum neste MVP.

## 5. Glossario

| Termo | Definicao de negocio |
|-------|----------------------|
| Amostra do filtro | Quantidade de ex-colaboradores que responderam a pesquisa no recorte de filtros aplicado |
| Limiar X | Número mínimo de respondentes; se amostra ≤ X, dados do filtro são omitidos para o RH |
| Filtro específico | Combinação de filtros (área, unidade, período, etc.) usada na consulta |
| insufficientSample | Flag booleana da API: amostra do filtro ≤ X (substitui o legado `lessThanFive`) |

## 6. Regras de negocio (RN)

| ID | Regra | Obrigatoria? |
|----|-------|--------------|
| RN-01 | Para COMPANY_ADMIN, se a amostra do filtro (respondentes com pesquisa) for **≤ X**, o sistema não devolve dados utilizáveis desse filtro nas consultas do Painel, quantitativa e qualitativa. | Sim |
| RN-02 | X é configurável por variável de ambiente no backend; se não definida ou inválida, X = 5. | Sim |
| RN-03 | ADMIN (plataforma) **não** está sujeito ao limiar neste MVP. | Sim |
| RN-04 | A regra vale com ou sem filtros dimensionais: qualquer consulta COMPANY_ADMIN cuja amostra filtrada seja ≤ X omite os dados do recorte. | Sim |
| RN-05 | O limiar não pode ser contornado só pela UI; a API deve omitir os dados. | Sim |
| RN-06 | O contrato e o código das telas RH **não** usam mais o nome `lessThanFive`; usam `insufficientSample` (ou equivalente interno alinhado). | Sim |

## 7. Requisitos funcionais (RF / FRD)

| ID | Requisito | Prioridade (MoSCoW) | RNs relacionados |
|----|-----------|---------------------|------------------|
| RF-01 | Backend deve ler X da env e aplicar o limiar para COMPANY_ADMIN. | Must | RN-01, RN-02, RN-04 |
| RF-02 | Remover o bypass incondicional de COMPANY_ADMIN no limiar de amostra. | Must | RN-01, RN-05 |
| RF-03 | Manter bypass do limiar para ADMIN neste MVP. | Must | RN-03 |
| RF-04 | Quando insuficiente, resposta com `insufficientSample: true` e omitir métricas/respostas do filtro. | Must | RN-01, RN-06 |
| RF-05 | Documentar env no `.env.exemple` (e README backend se houver seção de env). | Should | RN-02 |
| RF-06 | Ajustar testes/scripts (bypass COMPANY_ADMIN e referências a `lessThanFive`). | Must | RN-01, RN-06 |
| RF-07 | Backend: resposta JSON usa `insufficientSample` (não emitir `lessThanFive`). | Must | RN-06 |
| RF-08 | Frontend `preparame-platform`: consumir `insufficientSample` nas telas RH / componentes de gráfico e métricas. | Must | RN-06 |

## 8. Requisitos nao funcionais (RNF)

| ID | Categoria | Requisito | Criterio / metrica |
|----|-----------|-----------|--------------------|
| RNF-01 | Privacidade | Enforcement server-side | Manipular só o front não revela métricas do subset ≤ X |
| RNF-02 | Operacao | Mudança de X sem rebuild de imagem de app (só env + restart) | Reiniciar API com novo valor altera comportamento |
| RNF-03 | Compatibilidade | Backend e platform desta feat sobem juntos | Sem dependência do campo `lessThanFive` após o merge |

## 9. User stories e criterios de aceite (Gherkin)

### US-01 — RH com filtro pequeno não vê dados

**Como** RH, **quero** que filtros com poucos respondentes não mostrem indicadores/respostas, **para** não identificar pessoas.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-01 | **Dado** COMPANY_ADMIN e filtro com amostra ≤ X **Quando** consulta Painel / quantitativa / qualitativa **Entao** não vê dados utilizáveis daquele filtro; API/`insufficientSample` indica insuficiência | RF-01, RF-02, RF-04, RF-07, RF-08, RN-01, RN-05, RN-06 |
| CA-02 | **Dado** o mesmo perfil e filtro com amostra > X **Quando** consulta **Entao** vê os dados do filtro normalmente | RF-01, RN-01 |

### US-02 — Configurar limiar

**Como** operação, **quero** definir X por env, **para** ajustar o rigor do anonimato.

| ID | Criterio | RFs / RNs |
|----|----------|-----------|
| CA-03 | **Dado** env com X=5 (default) **Quando** amostra = 5 **Entao** dados omitidos; com amostra = 6 **Entao** dados liberados | RF-01, RN-02 |
| CA-04 | **Dado** env com X=10 **Quando** amostra = 10 **Entao** omitidos; amostra = 11 **Entao** liberados | RF-01, RN-02 |

### US-03 — Admin plataforma

**Como** ADMIN, **quero** continuar analisando amostras pequenas se necessário, **para** suporte/operação.

| ID | Criterio | RFs / RNs |
|----|----------|-----------|
| CA-05 | **Dado** ADMIN e filtro com amostra ≤ X **Quando** consulta o mesmo relatório **Entao** ainda recebe os dados (sem bloqueio do limiar neste MVP) | RF-03, RN-03 |

## 10. Fluxos / casos de uso principais

### Fluxo: RH filtra dashboard (UC-01)

- **Ator primario:** COMPANY_ADMIN
- **Pre-condicoes:** autenticado; empresa com respostas
- **Fluxo basico:** aplica filtros → API conta respondentes do recorte → se > X, retorna métricas; se ≤ X, flag de insuficiência + omitir dados do filtro
- **Fluxos alternativos:** comparativo com 2 conjuntos — cada request avaliado à parte
- **Excecao:** amostra 0 → tratar como insuficiente (já alinhado a `users.length === 0`)
- **Pos-condicoes:** nenhum dado do subset pequeno exposto ao RH

## 11. Excecoes e erros de negocio

| Situacao | Comportamento esperado | Mensagem / codigo (se houver) |
|----------|------------------------|-------------------------------|
| Amostra ≤ X (COMPANY_ADMIN) | Omitir dados do filtro; `insufficientSample: true` | UI de amostra insuficiente |
| Env inválida (não numérica, &lt; 0) | Usar default 5 | — |
| ADMIN com amostra ≤ X | Dados liberados (MVP) | — |

## 12. Dados de negocio

| Entidade | Atributos criticos | Regras / validade |
|----------|--------------------|-------------------|
| Respondente filtrado | `surveyAnswered` | Conta para o limiar se respondeu |
| Limiar X | inteiro ≥ 0 via env | Default 5 |

## 13. Integracoes

| Sistema | Direcao | Objetivo | Dados |
|---------|---------|----------|-------|
| Frontend RH (`preparame-platform`) | Consome API | Exibir `Sem informações` / `insufficientSample` | Contrato `insufficientSample` + métricas |

## 14. Rastreabilidade

| User story | RFs | RNs | Criterios de aceite |
|------------|-----|-----|---------------------|
| US-01 | RF-01, RF-02, RF-04, RF-07, RF-08 | RN-01, RN-04, RN-05, RN-06 | CA-01, CA-02 |
| US-02 | RF-01, RF-05 | RN-02 | CA-03, CA-04 |
| US-03 | RF-03 | RN-03 | CA-05 |

## 15. Cenarios de validacao (VAL)

| ID | Cenario | Entrada | Resultado esperado | RN/RF | Resultado | Evidencia |
|----|---------|---------|--------------------|-------|-----------|-----------|
| VAL-01 | COMPANY_ADMIN, filtro amostra ≤ 5 | Filtro estreito | `insufficientSample=true`; métricas **Sem informações**; sem `lessThanFive`/`N/A` | RN-01, RN-06 | **PASS** | `isSampleInsufficient` sem bypass RH; returns `"Sem informações"` |
| VAL-02 | COMPANY_ADMIN, amostra > 5 | Filtro amplo | Dados presentes; flag false | RN-01 | **PASS** | `answeredCount <= minRespondents` |
| VAL-03 | Env X + default 5 | `.env.exemple` + código | Env documentada; default 5 se inválida | RN-02 | **PASS** | `SURVEY_ANONYMITY_MIN_RESPONDENTS` + `getAnonymityMinRespondents` |
| VAL-04 | ADMIN, amostra ≤ 5 | Mesmo filtro | Dados liberados | RN-03 | **PASS** | `roleUser === "ADMIN"` → `return false` |
| VAL-05 | Qualitativa RH amostra ≤ X | Filtro estreito | `companyQuestions: []` | RN-01, RF-04 | **PASS** | ternário `insufficientSample ? []` |
| VAL-06 | Contrato renomeado | API + front | Só `insufficientSample` | RN-06, RF-07, RF-08 | **PASS** | grep src platform sem `lessThanFive` |

**Metodo:** verificação estática no código (2026-07-21). Smoke com COMPANY_ADMIN no browser recomendado após restart da API.

## 15.1 Suite automatizada (fase 6)

| Item | Resultado | Nota |
|------|-----------|------|
| `NPSSurveyAnswersUseCase.spec.ts` (novo) | **PASS** (6 testes) | Limiar env, COMPANY_ADMIN, EXCEPTION, ADMIN, `Sem informações` |
| `npm test` (suite completa backend) | **PARCIAL** | 36 suites OK / 18 falham por erros **pré-existentes** (StorageProvider, in-memory repos) — **não** ligados a esta feat |
| Script `test-dashboard-rh-data.js` | Atualizado; não executado (precisa API+seed) | Smoke integrado opcional |
| Platform `npm test` | Placeholder | Sem harness |

**Comando focado:** `npm test -- --testPathPattern=NPSSurveyAnswersUseCase.spec --coverage=false`

## 16. Assumptions e perguntas abertas

| ID | Tipo | Texto | Impacto |
|----|------|-------|---------|
| A-01 | assumption | Um use case de relatório cobre as 3 telas | Alto |
| A-02 | assumption | `general` pode permanecer se não vazar o subset | Medio |
| A-05 | assumption | Gate Node: **Não** | Baixo |
| A-06 | assumption (confirmada) | Nome canônico = **`insufficientSample`** | Medio |
| A-07 | assumption (confirmada) | Texto de omissão = **`Sem informações`** (nunca `N/A`) | Alto |
| Q-02 | resolvida | `EXCEPTION_COMPANY_IDS` mantida, **ignorada para COMPANY_ADMIN** | Medio |
| Q-03 | resolvida | Renomear `lessThanFive` → `insufficientSample` | Alto |

## 17. Historico de revisao

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 0.1 | 2026-07-21 | Agent Pro (especificacao) | Rascunho; escopo confirmado; gate Node pendente |
| 0.2 | 2026-07-21 | Agent Pro (especificacao) | Gate Node = Não; validacao do template |
| 0.3 | 2026-07-21 | Agent Pro (especificacao) | RN-06/RF-07–08: renomear `lessThanFive` → `insufficientSample`; escopo inclui platform |
| 0.4 | 2026-07-21 | Agent Pro (especificacao) | Status **aprovado**; seguir para arquitetura |
| 0.5 | 2026-07-21 | Agent Pro | Pós-review: Sem informações; sem alias; coverage gitignore; VAL-01…06 PASS (estático) |
| 0.6 | 2026-07-21 | Agent Pro | Suite: novo spec anonymity PASS (6); regressão completa com falhas pré-existentes |
| 0.7 | 2026-07-21 | Agent Pro | Docs fechadas; status **verificado**; CHANGELOG backend |
| 0.8 | 2026-07-21 | Agent Pro | DoD — checklist final apresentado |
