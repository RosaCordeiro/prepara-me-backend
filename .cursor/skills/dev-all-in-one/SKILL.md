---
name: dev-all-in-one
description: >-
  Orquestra o Agent Pro: classificacao feat/fix + branch na especificação,
  arquitetura, desenvolvimento, code review, teste de RN, teste automatizado e
  documentacao. Use quando o usuario escolher Pro, pedir all-in-one / orquestrador
  completo, ou fluxo consultivo completo.
---

# Dev All-in-One

Orquestrador pessoal. Responda em portugues. Prefira WSL/Linux e Docker; evite Windows nativo.

## Disciplina de fases (obrigatoria — nao negociar)

1. **Uma fase por vez.** Nao empilhar review + VAL + suite + docs + DoD + push na mesma resposta.
2. **Entregavel concreto** da fase atual (ver tabela abaixo) **antes** de pedir avancao.
3. **Fim de fase = `AskQuestion`** com opcoes fixas. Sem AskQuestion, a fase **nao** esta fechada.
4. **`pode seguir` / `ok` / `sim`** so avanca **a proxima fase unica** — nunca interpreta como licenca para pular AskQuestion das fases seguintes nem para empilhar o restante do pipeline.
5. **Desvio de escopo** (mudanca de RN/UI/API fora do design aprovado): **parar**, atualizar SPEC e/ou design, **AskQuestion de reaprovacao**, so entao continuar desenvolvimento.
6. **Commit/push** so apos fase 8 (DoD) aprovada — ou se o usuario pedir explicitamente “subir para o git” (ainda assim registrar no DoD).

## Perguntas com seletor (`AskQuestion`)

Sempre que a decisao tiver **opcoes fixas** (tipo feat/fix, aprovar fase, proximo passo):

- Usar o tool **`AskQuestion`** (UI clicavel do Cursor) — **obrigatorio** no fechamento de cada fase 1–8.
- Nao pedir "responda sim/nao" nem listas numeradas para digitar **quando AskQuestion estiver disponivel**.
- No maximo **um** `AskQuestion` por mensagem; labels curtos.
- Opcional: `Outro (eu digito)`.
- Se `AskQuestion` **nao existir** no turno: prosa curta com as **mesmas** opcoes (1/2/3) — ainda assim **uma fase por vez**.

Avance **somente** apos o usuario confirmar a fase atual.

Prompts tipicos de fechamento (usar via AskQuestion):

| Apos fase | Prompt | Opcoes |
|-----------|--------|--------|
| 1 Spec | A especificacao esta correta e completa? | Sim, seguir para arquitetura \| Ajustar \| Outro |
| 2 Design | O system design esta ok para implementar? | Sim, seguir para desenvolvimento \| Ajustar design \| Outro |
| 3 Dev | Desenvolvimento do MVP ok? | Sim, seguir para code review \| Ajustar codigo \| Outro |
| 4 Review | Code review ok? | Sim, seguir para teste de regra de negocio \| Corrigir achados \| Outro |
| 5 VAL/V | Testes de regra de negocio ok? | Sim, seguir para testes automatizados \| Ajustar \| Outro |
| 6 Suite | Suite automatizada ok? | Sim, seguir para documentacao \| Corrigir falhas \| Outro |
| 7 Docs | Documentacao ok? | Sim, seguir para Definition of Done \| Ajustar docs \| Outro |
| 8 DoD | DoD completo — podemos encerrar? | Sim, encerrar \| Subir para o git e encerrar \| Falta item — voltar \| Outro |

## Fases (ordem obrigatoria)

```text
1. Especificacao (feat|fix + branch + modelo)
2. Arquitetura
3. Desenvolvimento
4. Code review
5. Teste de regra de negocio
6. Teste automatizado
7. Documentacao
8. Definition of Done (gate final — checklist abaixo)
```

### Entregavel minimo por fase (concreto)

| Fase | So avanca se existir |
|------|----------------------|
| 1 Spec | Arquivo SPEC/CORR na branch `feat/` ou `fix/`; validacao PASS; gate Node decidido se aplicavel; **AskQuestion** |
| 2 Design | Arquivo `-design.md` (ou equivalente); recomendacao + trade-offs; **AskQuestion** |
| 3 Dev | Codigo na branch alinhado ao design; resumo do que mudou; **AskQuestion** (sem suite geral nem doc final aqui) |
| 4 Review | Veredito + checklist review; bloqueantes corrigidos ou listados; **AskQuestion** |
| 5 RN | Matriz de verificacao no doc (VAL/V executados + observaveis + acao auto); **AskQuestion** |
| 6 Auto | Specs backend criados/atualizados a partir da matriz; **suite geral** backend verde (ou falhas corrigidas); **AskQuestion** |
| 7 Docs | README R1–R10 + CHANGELOG/SPEC status; **AskQuestion** |
| 8 DoD | Checklist DoD percorrido com o usuario; **AskQuestion** de encerramento |

### 1. Especificacao

- **Sempre** passar pela skill `especificacao` primeiro (ela classifica feat vs fix).
- Se ambiguo: AskQuestion `Feat` | `Fix`.
- **Abrir branch na hora** (`feat/<slug>` ou `fix/<slug>`) — docs de RN/issue entram nessa branch.
- **feat** → [modelo-feat.md](../especificacao/modelo-feat.md) via `especificacao`
- **fix** → [modelo-fix.md](../correcao-erro/modelo-fix.md) via `correcao-erro`
- Documento **aprovado** = fonte da verdade. So entao fase 2.

### 2. Arquitetura / system design

- Skill `arquitetura`.
- Design completo (contexto, componentes, dados, fluxos, infra, riscos, MVP).
- Aguardar aprovacao (**AskQuestion**) antes de codar produto.

### 3. Desenvolvimento

- Skills especialistas conforme o pedaco: `frontend`, `backend`, `script`, `rag`, `mcp`, `fiori`, `ui5`, `abap`.
- Seguir spec + design aprovados. Codigo legivel; sem over-engineering.
- Trabalhar **na branch ja aberta** na fase 1 (nao reabrir discussao de branch aqui, salvo desvio justificado).
- Ainda **nao** e a fase de suite ampliada nem de doc final.
- Fechar com **AskQuestion** (nao pular para review+VAL+suite na mesma mensagem).

### 4. Code review

- Skill `review` — foco em qualidade, seguranca, aderencia a spec/design.
- Corrigir achados bloqueantes antes de seguir.
- Fechar com **AskQuestion**.

### 5. Teste de regra de negocio

- Skill `teste-regra-negocio`.
- Executar VAL-xx / V-xx **no sistema** e preencher a **matriz de verificacao** no doc (contrato GWT + observaveis + acao auto).
- Essa matriz e a entrada obrigatoria da fase 6.
- Fechar com **AskQuestion**.

### 6. Teste automatizado

- Skill `teste-automatizado`.
- **Ler a matriz** da fase 5; **criar ou atualizar** testes Jest do **backend** para cada `criar`/`atualizar`.
- Toda mudanca de comportamento na API exige novo teste ou alteracao de existente (salvo debito na matriz).
- **Obrigatorio:** suite **geral** do backend afetado — filtro pontual nao conta como evidencia final.
- Sem testes front nesta politica atual.
- Fechar com **AskQuestion**.

### 7. Documentacao

- Skill `documentacao` (ler o SKILL.md — **revisao obrigatoria do README**, checklist R1–R10).
- Nao aceitar “so atualizei o status do SPEC”: endpoints, env, ops, observabilidade e indice de docs devem refletir a entrega quando aplicavel.
- README/`--help`, CHANGELOG se existir, status final SPEC/CORR.
- Fechar com **AskQuestion**.

### 8. Definition of Done (gate final)

- Percorrer o checklist **Definition of Done** abaixo com o usuario (itens visiveis).
- Marcar `N/A` so com motivo (ex.: SAP on-prem sem Compose).
- **`AskQuestion`**: `DoD completo — podemos encerrar?`
  - `Sim, encerrar` | `Subir para o git e encerrar` | `Falta item — voltar` | `Outro (eu digito)`
- So encerra a entrega Pro com DoD ok (ou N/A justificados).

## Routing

| Situacao | Skill |
|----------|--------|
| Classificar feat/fix, spec feat, abrir branch | `especificacao` |
| Spec fix (causa, evidencia, justificativa) | `correcao-erro` |
| System design, ADRs, MVP, C++ desktop | `arquitetura` |
| Vue/React UI | `frontend` |
| API/DB/Docker servicos | `backend` |
| CLI/shell/automacao | `script` |
| RAG | `rag` |
| MCP | `mcp` |
| Fiori Launchpad | `fiori` |
| UI5 | `ui5` |
| ABAP/CDS/RAP | `abap` |
| Code review | `review` |
| VAL/V / aceite de negocio | `teste-regra-negocio` |
| Suite automatizada | `teste-automatizado` |
| README/help/fechamento docs | `documentacao` |

Leia `~/.cursor/skills/<nome>/SKILL.md` antes de executar o papel correspondente.

## Stack preferida

- Runtime: WSL/Linux, Docker, Docker Compose
- DB: Postgres, Sybase, MongoDB
- Linguagens: JS/TS, Go, Python, ABAP; C++ via `arquitetura`; PowerBuilder so em duvidas
- SAP: `fiori` + `ui5` + `abap` (nao misturar com frontend/backend genericos)

## Definition of Done (padrao)

Ate o usuario definir outro DoD. Usar como **fase 8** (gate final) apos a documentacao:

- [ ] Especificacao escrita e aprovada (feat → `modelo-feat` / fix → `modelo-fix`; branch `feat/` ou `fix/` criada na fase 1)
- [ ] System design aprovado
- [ ] Testes de regra de negocio cobrindo os fluxos principais (VAL-xx / V-xx) **com matriz de verificacao no doc**
- [ ] Testes automatizados: matriz consumida; specs backend criados/atualizados para a entrega; **suite geral** backend rodada e verde (ou N/A so se o projeto nao tiver suite; filtro pontual nao conta como DoD). Front auto: N/A na politica atual.
- [ ] Documentacao geral em dia: **README revisado** (checklist R1–R10 da skill `documentacao`: endpoints/env/ops/observabilidade/indice quando a entrega tocar) + status final do SPEC/CORR; CHANGELOG se o repo tiver
- [ ] Roda em WSL/Linux (ou N/A justificado, ex.: so SAP on-prem)
- [ ] Compose sobe servicos quando aplicavel (N/A se nao houver)
- [ ] Sem secrets no codigo
- [ ] Lint/typecheck ok se o projeto ja tiver
- [ ] Code review sem bloqueantes abertos
- [ ] Fases 1–8 cada uma fechada com **AskQuestion** (nao empilhadas)
