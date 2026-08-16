---
name: teste-regra-negocio
description: >-
  Executa e documenta VAL-xx / V-xx contra o sistema real, preenchendo a matriz
  de verificacao que a fase teste-automatizado consome. Use na fase 5 do Dev
  All-in-One ou quando o usuario pedir validacao de RN, aceite, GWT ou V-xx.
---

# Teste de regra de negocio

Fase **depois** do code review e **antes** de `teste-automatizado`.
Responda em portugues.

## Papel desta fase

1. **Avaliar o sistema** — o que foi pedido (SPEC/CORR + design) esta de fato no comportamento observado?
2. **Registrar o contrato** — cada VAL/V vira linha completa na **matriz de verificacao** (dados que o Jest vai ler depois).
3. **Nao** escrever suite Jest ampla aqui — isso e a fase seguinte. Pode usar smoke HTTP/script pontual so para evidenciar PASS/FAIL.

## Fontes obrigatorias

| Tipo | Documento | IDs |
|------|-----------|-----|
| feat | `docs/**/especificacoes/*` (modelo-feat §15 + CA/Gherkin) | `VAL-xx` (e `CA-xx` / `RN-xx` ligados) |
| fix | `docs/**/correcoes/*` (modelo-fix §8) | `V-xx` |

Se a matriz ainda nao existir no doc: **criar nesta fase** a partir dos VAL/V ja listados (completar colunas vazias). Nao inventar RN fora do documento aprovado.

## Matriz de verificacao (contrato para o automatizado)

Gravar **no doc da branch** (SPEC ou CORR), secao dedicada — tipicamente apos o plano VAL/V:

```markdown
## Matriz de verificacao (fase teste-regra-negocio)

| ID | RN/causa | Dado | Quando | Entao (observaveis) | Alvo backend | Resultado | Evidencia | Spec sugerido | Acao auto |
|----|----------|------|--------|---------------------|--------------|-----------|-----------|---------------|-----------|
| V-01 | ... | ... | ... | status 400; message Invalid id; findById nao chamado | GetCompanyParametersUseCase | PASS | HTTP local 400 | .../GetCompanyParametersUseCase.spec.ts | criar |
```

### Colunas (obrigatorias)

| Coluna | Conteudo |
|--------|----------|
| **ID** | `VAL-xx` ou `V-xx` estavel (mesmo do plano) |
| **RN/causa** | `RN-xx` / `RF-xx` ou causa raiz do CORR |
| **Dado / Quando / Entao** | GWT observavel — sem “funciona” generico |
| **Entao (observaveis)** | Lista checavel: HTTP status/body, campo de retorno, side-effect (ex.: nao chama repo X), mensagem de erro |
| **Alvo backend** | Use case / rota / modulo da API (path do arquivo quando souber) |
| **Resultado** | `PASS` \| `FAIL` \| `BLOQUEADO` |
| **Evidencia** | Curta: comando, status, trecho de log, print path — o suficiente para auditar |
| **Spec sugerido** | Caminho `*.spec.ts` no **backend** (criar ou existente) |
| **Acao auto** | `criar` \| `atualizar` \| `ja-cobre` \| `debito` |

### Regras da matriz

- Todo VAL/V do **MVP / severidade da entrega** precisa de linha.
- **Entao** deve ser automatizavel depois (assert Jest). Se so for “UI ficou bonita”, reformular ou marcar `debito` com motivo (ex.: so front — fora do escopo auto atual).
- Escopo auto atual: **somente backend**. Front: se o VAL for so UI, `Acao auto = debito` + motivo `front fora do escopo auto`.
- `ja-cobre`: so se existir teste que ja asserta os **mesmos observaveis** (citar `describe`/`it` na evidencia).
- `debito`: excepcional; precisa motivo e acordo no AskQuestion de falha/debito.

## Processo

1. Listar VAL/V obrigatorios do doc aprovado.
2. Completar GWT + observaveis + alvo backend **antes** ou **durante** a execucao (contrato claro).
3. Executar cada cenario contra o sistema (API local, script, ou fluxo documentado). Preferir evidencia objetiva.
4. Preencher Resultado + Evidencia + Spec sugerido + Acao auto.
5. Se **FAIL**: AskQuestion `Corrigir agora` | `Registrar debito e seguir` | `Outro`.
6. Atualizar o doc da branch com a matriz completa (obrigatorio — nao so no chat).
7. Resumo ao usuario: quantos PASS/FAIL/BLOQUEADO; quantos `criar`/`atualizar`/`debito` para a proxima fase.
8. **Nao** iniciar suite geral Jest nem documentacao final nesta fase.
9. **AskQuestion**: `Testes de regra de negocio ok?`
   - `Sim, seguir para testes automatizados` | `Ajustar` | `Outro (eu digito)`

## Gate para fechar a fase

So fecha se:

- [ ] Matriz no doc com **todas** as colunas preenchidas para os VAL/V do MVP
- [ ] Nenhum Resultado em branco
- [ ] Pelo menos um PASS nos fluxos principais **ou** FAIL/debito tratado via AskQuestion
- [ ] Toda linha `criar`/`atualizar` tem Spec sugerido no backend

## Nao fazer nesta fase

- Suite completa de regressao/CI (`teste-automatizado`)
- Inventar testes front “por enquanto”
- Documentacao final, DoD ou push
- Ampliar escopo de produto sem reaprovacao de SPEC/design
