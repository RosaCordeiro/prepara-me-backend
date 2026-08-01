# SPEC — Melhorias Open to Work (Company Admin)

## 1. Identificacao do documento

| Campo | Valor |
|-------|-------|
| Tipo | **feat** |
| Titulo | Melhorias da consulta Open to Work no Company Admin |
| Codigo / versao | SPEC-OTW-001 / v0.2 |
| Branch | `feat/rh-open-to-work-melhorias` (backend `master` + platform `main`) |
| Objetivo (1-2 frases) | Ajustar a lista Open to Work do RH: elegibilidade (permissao default + sem realocacao + LinkedIn opcional com aviso), filtros uteis e remocao de empresa/data da consulta de profissionais. |
| Solicitante / stakeholders | RH / Company Admin (Prepara.me) |
| Atores / personas | COMPANY_ADMIN (RH da empresa); ADMIN (se acessar a mesma tela, com escopo definido nas premissas) |
| Prioridade | MVP |
| Status | verificado |
| Data | 2026-07-21 |

## 2. Contexto e problema (BRD)

- **Situacao atual:** Tela *Contrate Open to Work* (`/replacementsReport`) lista profissionais com `showLinkedinInRelocationProgram = true` **e** `linkedinUrl` preenchido. Filtro compartilhado com o dashboard de recolocacao (datas + empresa). Coluna Empresa na tabela. Quem ja foi realocado ainda pode aparecer. Poucos registros na pratica.
- **Dor:** Lista incompleta (exige LinkedIn), filtros inadequados, ruido de empresa/data, e inclusao de quem ja foi realocado.
- **Por que agora:** Melhoria do fluxo ja entregue (LinkedIn / permissao Open to Work).
- **Restricoes:** Legado TypeORM + Quasar; nao redesenhar o dashboard de metricas de recolocacao alem do necessario para separar filtros.

## 3. Objetivos e metrica de sucesso

| Objetivo | Como medir (negocio) |
|----------|----------------------|
| RH ve mais candidatos elegiveis (com permissao, sem realocacao), mesmo sem LinkedIn | Contagem da lista sobe vs. criterio antigo (URL obrigatoria) no mesmo conjunto de dados |
| Clique sem LinkedIn comunica falta do link | Mensagem unica e clara ao acionar a acao de LinkedIn |
| Filtros de cargo/area/cidade/estado | RH consegue filtrar a lista por esses campos |
| Empresa e data fora da consulta OTW | UI e API da lista OTW sem filtro/coluna de empresa; data nao filtra a lista OTW |

## 4. Escopo

### 4.1 Em escopo

- Endpoint/lista Open to Work (`GET .../open-to-work`) e tabela *Profissionais Open to Work*
- Regras de elegibilidade: permissao, realocacao, LinkedIn opcional + mensagem
- Filtros OTW: cargo, area, cidade, estado
- Remover empresa (filtro e coluna) da consulta OTW
- Remover uso de data como filtro da lista OTW (e limpar o filtro compartilhado que hoje induz o RH a achar que data filtra OTW)
- Default da permissao Open to Work = **permitir** (confirmar create/update/UI e listagem)
- Escopo COMPANY_ADMIN: pool OTW de **outras** empresas (exclui a propria); sem filtro/coluna Empresa na UI

### 4.2 Fora de escopo

- Alterar metricas do dashboard de recolocacao (cards/percentuais) alem de separar/limpar filtros que confundem OTW
- Novo cadastro em massa de LinkedIn
- Notificacao automatica ao colaborador para preencher LinkedIn
- `@clamed/logger` e `light-node-metrics` (**Nao — nenhum neste MVP**, A-01)
- App mobile / outros perfis alem do fluxo Company Admin desta tela

### 4.3 Premissas e dependencias

- Premissas: tela continua em `/replacementsReport`; campo de permissao continua `showLinkedinInRelocationProgram`
- Dependencias: API backend + front platform
- **Gate Node (A-01):** **Nao** — nenhum `@clamed/logger` / `light-node-metrics` neste MVP

## 5. Glossario

| Termo | Definicao de negocio |
|-------|----------------------|
| Open to Work (OTW) | Lista de profissionais disponiveis para contrate / recolocacao na consulta do RH |
| Permissao OTW | Flag `showLinkedinInRelocationProgram`: colaborador autoriza aparecer na lista |
| Realocado / realocacao | Colaborador ja marcado como realocado no programa (`realocate = true` no employee e/ou usuario `REALOCATED`) |
| Cargo | Campo `position` do colaborador |
| Area | Campo `department` do colaborador |
| Cidade / Estado | Campos `city` / `state` do colaborador |

## 6. Regras de negocio (RN)

| ID | Regra | Obrigatoria? |
|----|-------|--------------|
| RN-01 | Default da permissao OTW e **permitir** (`true`) em criacao e quando valor ausente/nulo na leitura | Sim |
| RN-02 | So entra na lista OTW quem tem permissao OTW = permitir | Sim |
| RN-03 | So entra na lista OTW quem **nao** esta realocado. Criterio: `companyEmployee.realocate !== true`. Se existir usuario vinculado e `user.realocated === REALOCATED`, tambem exclui. **Usuario vinculado nao e obrigatorio** — colaborador sem user pode aparecer (desde que nao realocado e demais RNs) | Sim |
| RN-04 | LinkedIn **nao** e obrigatorio para aparecer na lista OTW | Sim |
| RN-05 | Ao acionar LinkedIn sem URL, o sistema **nao** abre perfil externo e exibe mensagem informando que falta o link | Sim |
| RN-06 | Ao acionar LinkedIn com URL valida, abre o perfil em nova aba (comportamento atual) | Sim |
| RN-07 | COMPANY_ADMIN ve na lista OTW apenas profissionais de **outras empresas** (nao da propria). A propria empresa fica de fora do pool “Contrate” | Sim |
| RN-08 | Filtros da lista OTW: cargo, area, cidade, estado (combinaveis; vazios = sem restrição no campo) | Sim |
| RN-09 | Lista OTW **nao** exibe coluna Empresa e **nao** oferece filtro Empresa (identidade da empresa de origem nao e necessaria na UI) | Sim |
| RN-10 | Datas **nao** filtram a lista OTW | Sim |

## 7. Requisitos funcionais (RF / FRD)

| ID | Requisito | Prioridade (MoSCoW) | RNs relacionados |
|----|-----------|---------------------|------------------|
| RF-01 | API OTW deve listar elegiveis conforme RN-01..04 e RN-07 (outras empresas para COMPANY_ADMIN), aceitando filtros position, department, city, state | Must | RN-01..04, RN-07, RN-08 |
| RF-02 | API OTW nao deve exigir `linkedinUrl` preenchido | Must | RN-04 |
| RF-03 | API OTW deve excluir realocados (RN-03) | Must | RN-03 |
| RF-04 | Front lista OTW: filtros cargo/area/cidade/estado; sem empresa; sem data na consulta OTW | Must | RN-08..10 |
| RF-05 | Front: coluna Empresa removida da tabela OTW | Must | RN-09 |
| RF-06 | Front: clique LinkedIn sem URL → mensagem (ex.: *“LinkedIn não informado. Atualize o perfil do colaborador para visualizar o link.”*); com URL → abrir link | Must | RN-05, RN-06 |
| RF-07 | Confirmar/ajustar fluxos de create/update/UI da permissao para default permitir; se dados legados estiverem `false` por engano de UX, nao forcar overwrite em massa sem confirmacao (ver A-02) | Must | RN-01 |

## 8. Requisitos nao funcionais (RNF)

| ID | Categoria | Requisito | Criterio / metrica |
|----|-----------|-----------|--------------------|
| RNF-01 | Seguranca / negocio | COMPANY_ADMIN nao ve profissionais da propria empresa no OTW | Resposta nunca inclui `companyId` = empresa do usuario logado |
| RNF-02 | Usabilidade | Mensagem sem LinkedIn em portugues claro | Texto unico, sem jargao tecnico |
| RNF-03 | Observabilidade | Sem novos pacotes logger/metrics | A-01 |

## 9. User stories e criterios de aceite (Gherkin)

### US-01 — Ver lista OTW completa e filtravel

**Como** RH (COMPANY_ADMIN), **quero** ver profissionais elegiveis da minha empresa com filtros de cargo/area/cidade/estado, **para** achar candidatos Open to Work com mais precisao.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-01 | **Dado** colaboradores de **outras** empresas com permissao OTW e nao realocados (com ou sem user) **Quando** abro a consulta OTW **Entao** vejo-os mesmo sem LinkedIn | RF-01, RF-02, RN-02..04, RN-07 |
| CA-02 | **Dado** a lista OTW **Quando** filtro por cargo/area/cidade/estado **Entao** a lista reflete apenas os que batem com os filtros preenchidos | RF-04, RN-08 |
| CA-03 | **Dado** a tela OTW **Quando** visualizo filtros e colunas **Entao** nao ha filtro/coluna Empresa e data nao restringe a lista OTW | RF-04, RF-05, RN-09, RN-10 |
| CA-03b | **Dado** colaboradores da **minha** empresa elegiveis por permissao **Quando** abro OTW como COMPANY_ADMIN **Entao** eles **nao** aparecem | RF-01, RN-07 |

### US-02 — LinkedIn ausente

**Como** RH, **quero** ser avisado ao tentar abrir LinkedIn inexistente, **para** saber que falta cadastrar o link.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-04 | **Dado** linha sem `linkedinUrl` **Quando** aciono a acao de LinkedIn **Entao** vejo a mensagem de falta de link e nao abro URL externa | RF-06, RN-05 |
| CA-05 | **Dado** linha com `linkedinUrl` **Quando** aciono LinkedIn **Entao** o perfil abre em nova aba | RF-06, RN-06 |

### US-03 — Sem realocados

**Como** RH, **quero** que so aparecam pessoas ainda nao realocadas, **para** nao ofertar quem ja saiu do programa.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-06 | **Dado** colaborador realocado **Quando** carrego OTW **Entao** ele nao aparece na lista | RF-03, RN-03 |

## 10. Fluxos / casos de uso principais

### Fluxo: Consultar Open to Work (UC-01)

- **Ator primario:** COMPANY_ADMIN
- **Pre-condicoes:** autenticado; empresa vinculada (para excluir a propria do pool)
- **Fluxo basico:** abre tela → sistema carrega OTW de outras empresas → opcionalmente aplica filtros cargo/area/cidade/estado → lista atualiza → aciona LinkedIn (com ou sem URL)
- **Fluxos alternativos:** limpar filtros OTW → lista elegivel completa (outras empresas)
- **Fluxos de excecao:** COMPANY_ADMIN sem empresa vinculada → erro de negocio; falha de API → feedback de erro generico da tela
- **Pos-condicoes:** nenhuma persistencia obrigatoria

## 11. Excecoes e erros de negocio

| Situacao | Comportamento esperado | Mensagem / codigo (se houver) |
|----------|------------------------|-------------------------------|
| LinkedIn vazio no clique | Nao navega; notifica | “LinkedIn não informado. Atualize o perfil do colaborador para visualizar o link.” |
| COMPANY_ADMIN sem companyId | Nao lista | Erro 400 existente / equivalente |
| Filtros sem match | Lista vazia | Estado vazio da tabela (sem erro) |

## 12. Dados de negocio

| Entidade | Atributos criticos | Regras / validade |
|----------|--------------------|-------------------|
| CompanyEmployee | showLinkedinInRelocationProgram, linkedinUrl, realocate, position, department, city, state, companyId | Permissao default true; OTW sem exigir URL |
| User (vinculado) | realocated | Se REALOCATED, fora da lista OTW |

## 13. Integracoes (se houver)

N/A — apenas API interna Prepara.me e UI platform.

## 14. Rastreabilidade (minima)

| User story | RFs | RNs | Criterios de aceite |
|------------|-----|-----|---------------------|
| US-01 | RF-01, RF-02, RF-04, RF-05 | RN-01..04, RN-07..10 | CA-01..03, CA-03b |
| US-02 | RF-06 | RN-05, RN-06 | CA-04, CA-05 |
| US-03 | RF-03 | RN-03 | CA-06 |

## 15. Cenarios de validacao de regra de negocio (fase dedicada pos-review)

| ID | Cenario | Entrada | Resultado esperado | RN/RF |
|----|---------|---------|--------------------|-------|
| VAL-01 | Sem LinkedIn + permissao + nao realocado (com ou sem user) | employee elegivel outra empresa | Aparece na lista | RN-03, RN-04, RF-02 | **PASS** (codigo: sem filtro linkedinUrl; left join user) |
| VAL-02 | Clique sem LinkedIn | linha sem URL | Mensagem; sem navegacao | RN-05, RF-06 | **PASS** (UI: `notifyMissingLinkedin` + `@click.prevent`) |
| VAL-03 | Realocado | realocate true ou user REALOCATED | Nao aparece | RN-03, RF-03 | **PASS** (codigo: WHERE realocate/user) |
| VAL-04 | Filtro area/cidade | department/city preenchidos | Lista filtrada | RN-08, RF-04 | **PASS** (API query + UI params) |
| VAL-05 | COMPANY_ADMIN empresa A | elegiveis em A e B | So B (outras); sem A; sem coluna empresa | RN-07, RN-09 | **PASS** (excludeCompanyId; coluna removida) |
| VAL-06 | Default permissao | create sem flag / nulo | Tratado como permitir | RN-01, RF-07 | **PASS** (NULL OR true na query; map create ja default true) |
| VAL-07 | Sem user vinculado | employee outra empresa, nao realocado, permissao OK | Aparece | RN-03 | **PASS** (`u.id IS NULL` permitido) |

**Execucao:** 2026-07-22 — review de codigo + `ListCompanyEmployeeUseCase.spec` (6/6). Smoke E2E em ambiente com dados reais: recomendado no PR.

**Desvio aprovado pelo usuario:** removidos filtros/metricas do dashboard de recolocacao da mesma tela; so listagem OTW.


## 16. Assumptions e perguntas abertas

| ID | Tipo | Texto | Impacto se errado |
|----|------|-------|-------------------|
| A-01 | assumption | Sem `@clamed/logger` / `light-node-metrics` neste MVP | Baixo |
| A-02 | assumption | Nao ha migration em massa forçando `showLinkedinInRelocationProgram=true` em quem ja optou por `false`; foco e default + listagem + UX | Medio |
| A-03 | assumption | Criterio “sem realocacao”: `realocate !== true`; se houver user e `REALOCATED`, exclui. **Nao exige user** para aparecer | Alto |
| A-04 | assumption | Datas podem permanecer **somente** para o bloco de metricas de recolocacao (se mantido na mesma pagina), desde que claramente separados e **nao** afetem a lista OTW; filtro Empresa some da UI OTW | Medio |
| A-05 | assumption | Texto da mensagem de LinkedIn ausente conforme secao 11 (ajustavel na aprovacao) | Baixo |
| A-06 | assumption | “Outras empresas” = `companyId <>` empresa do COMPANY_ADMIN logado | Alto |
| Q-01 | pergunta | ADMIN global: ve todas as empresas (incluindo todas), ou tambem segue alguma exclusao? | Medio |

## 17. Historico de revisao

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 0.1 | 2026-07-21 | Agent Pro | Rascunho inicial |
| 0.2 | 2026-07-21 | Agent Pro | RN-03: user opcional; RN-07: OTW de outras empresas (nao a propria) |

---

## Checklist de validacao (pre-aprovacao)

| Item | Resultado |
|------|-----------|
| A Completude template + branch | PASS |
| B Qualidade requisitos | PASS |
| C Rastreabilidade | PASS |
| D Escopo + A-01 Node gate | PASS |
| Q-01 aberta (nao bloqueia MVP se escopo COMPANY_ADMIN) | PASS com pergunta |

```text
Validacao: PASS
Pode pedir aprovacao?: Sim
```
