---
name: teste-automatizado
description: >-
  Le a matriz de verificacao da fase de regra de negocio, cria ou atualiza
  testes Jest do backend para cada VAL/V, e roda a suite geral. Use na fase 6
  do Dev All-in-One ou quando o usuario pedir jest, CI, cobertura ou regressao.
---

# Teste automatizado

Fase **depois** de `teste-regra-negocio` e **antes** de documentacao geral.
Responda em portugues.

## Papel desta fase

1. **Ler a matriz de verificacao** no SPEC/CORR (preenchida na fase 5).
2. **Criar ou alterar** testes automatizados no **backend** para cada linha com `Acao auto = criar` ou `atualizar`.
3. **Rodar a suite geral** do(s) repo(s) backend afetados e corrigir quebras desta branch.
4. Atualizar a matriz (`ja-cobre` / evidencia do `it`) e so entao pedir Avanco.

**Escopo atual:** somente **backend** (Jest / `*.spec.ts`). Front: nao criar testes; se a matriz tiver so UI, respeitar `debito` ja registrado.

## Entrada obrigatoria

- Documento da entrega na branch com secao **Matriz de verificacao**.
- Se a matriz faltar ou estiver incompleta: **voltar** para `teste-regra-negocio` (nao improvisar VAL/V na conversa).

## Regra de ouro — toda alteracao de produto

Qualquer mudanca de comportamento na API nesta entrega exige:

- **novo** teste automatizado, **ou**
- **alteracao** de teste existente que cubra a RN,

mapeado a pelo menos um VAL/V da matriz.

Excecoes so com `Acao auto = debito` justificado na matriz (ex.: doc-only, front-only).

Proibido fechar a fase com “codigo mudou e nenhum `*.spec.ts` tocado” sem debito explícito.

## Qualidade do assert (anti-teste fraco)

Cada `it` ligado a um VAL/V deve assertar os **observaveis** da coluna Entao. Evitar como unico assert:

- `toBeDefined()` / `toHaveProperty("id")` sem checar a regra
- “nao lancou erro” sem verificar efeito colateral
- duplicar happy path sem o caso negativo da RN

Padrao desejado:

- caminho da regra (ex.: id `"null"` → `AppError` 400)
- efeito colateral (ex.: `findById` **nao** chamado)
- regressao minima do caminho valido relacionado (ex.: `TUDO` ainda funciona), se o V/VAL pedir

Nome do teste: preferir incluir o ID (`should reject null id (V-04)` ou `VAL-01 ...`).

## Processo

1. Abrir a matriz no doc; listar linhas `criar` / `atualizar` / `ja-cobre` / `debito`.
2. Para cada `criar`/`atualizar`:
   - Implementar ou ajustar o `*.spec.ts` no alvo backend.
   - Preferir repositorio in-memory / mocks ja usados no modulo.
   - Rodar filtro pontual enquanto desenvolve o spec.
3. Marcar na matriz: `Acao auto = ja-cobre` + evidencia (`arquivo` + nome do `it`).
4. **Suite geral** do backend afetado (`npm test` ou comando padrao do repo).
   - Filtro pontual **nao** conta como evidencia final da fase.
   - Corrigir falhas introduzidas por esta branch (harness dessincronizado conta).
5. Se o monorepo tiver frontend na entrega: suite front so se ja existir e for obrigatoria do repo; **nao** inventar testes front nesta politica.
6. Relatar: specs criados/alterados; mapa VAL/V → `it`; resultado da suite geral; debitos remanescentes.
7. **Nao** iniciar documentacao final nem DoD/push nesta fase.
8. **AskQuestion**: `Suite automatizada ok?`
   - `Sim, seguir para documentacao` | `Corrigir falhas` | `Outro (eu digito)`

## Gate para fechar a fase

- [ ] Toda linha `criar`/`atualizar` da matriz virou `ja-cobre` **ou** `debito` acordado
- [ ] Pelo menos um arquivo `*.spec.ts` do backend **criado ou modificado** se houve mudanca de comportamento na API
- [ ] Suite **geral** backend rodada; resultado reportado (pass/fail)
- [ ] Matriz atualizada no doc da branch

## Limites

- Nao substituir a execucao humana/sistema da fase 5 — a matriz e a fonte; o Jest a cristaliza.
- Nao expandir cobertura historica de todo o monorepo sem pedido — foque na entrega + regressao da suite geral.
- Nao marcar PASS de VAL/V so porque o teste passou se a fase 5 registrou FAIL (alinhar com o usuario).
