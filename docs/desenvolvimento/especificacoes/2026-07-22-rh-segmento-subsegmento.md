# SPEC — Cadastro de Segmento/Subsegmento, campos na Empresa e filtros no Open to Work

## 1. Identificacao do documento

| Campo | Valor |
|-------|-------|
| Tipo | **feat** |
| Titulo | Cadastro de Segmento e Subsegmento (Admin), campos opcionais na Empresa e filtros dropdown no Open to Work (Company Admin) |
| Codigo / versao | SPEC-2026-07-22-rh-segmento-subsegmento / v0.2 |
| Branch | `feat/rh-segmento-subsegmento` |
| Objetivo (1-2 frases) | Permitir que o Admin cadastre segmentos e subsegmentos de mercado; associar (opcionalmente) esses valores à empresa; e permitir que o Company Admin filtre e visualize Segmento/Subsegmento na listagem Open to Work (origem = empresa do colaborador, sem exibir o nome da empresa). |
| Solicitante / stakeholders | Produto / RH Prepara.me |
| Atores / personas | ADMIN (cadastros e empresa); COMPANY_ADMIN (filtros Open to Work) |
| Prioridade | MVP |
| Status | **verificado** |
| Data | 2026-07-22 |

## 2. Contexto e problema (BRD)

- **Situacao atual:** nao existem entidades de Segmento/Subsegmento. Empresa possui essencialmente identificacao basica (ex.: nome). O Open to Work (Company Admin) filtra por texto livre (cargo, area, cidade, estado) quando disponivel, sem classificacao de mercado da empresa de origem do candidato.
- **Dor:** impossivel organizar empresas e buscar talentos Open to Work por segmentos de mercado (ex.: varejo farmaceutico, industria de minerios).
- **Por que agora:** demanda de negocio para classificar empresas e enriquecer o filtro do Open to Work.
- **Restricoes:** campos na empresa **nao obrigatorios**; cadastros apenas no Admin; filtros de segmento/subsegmento no Open to Work devem ser **dropdown** (diferente dos filtros textuais atuais).

## 3. Objetivos e metrica de sucesso

| Objetivo | Como medir (negocio) |
|----------|----------------------|
| Admin cadastra segmentos e subsegmentos | ADMIN cria/edita/lista/remove com sucesso nas telas de cadastro |
| Empresa pode ter segmento e subsegmento opcionais | ADMIN salva empresa com 0, 1 ou ambos os campos; sem bloquear cadastro sem eles |
| Company Admin filtra OTW por segmento/subsegmento | Dropdowns listam opcoes cadastradas; resultado da listagem respeita o filtro |
| Listagem OTW exibe Segmento e Subsegmento | Colunas visiveis com valores da empresa do colaborador; coluna Empresa ausente |

## 4. Escopo

### 4.1 Em escopo

- Cadastro de **Segmento** no Admin (CRUD: listar, criar, editar, remover).
- Cadastro de **Subsegmento** no Admin (CRUD separado do Segmento).
- Relacao de negocio: cada Subsegmento **pertence a um Segmento** (ver A-01).
- Campos **opcionais** na Empresa: Segmento e Subsegmento.
- Validacao: se Empresa tiver Subsegmento, o Subsegmento deve pertencer ao Segmento informado (quando Segmento tambem estiver preenchido); se so Subsegmento, o Segmento da empresa pode ser inferido/exigido conforme A-02.
- Filtros **Segmento** e **Subsegmento** no relatorio/tela **Open to Work** do COMPANY_ADMIN, via **dropdown** (selecao a partir dos cadastros).
- API de listagem/consulta dos cadastros para popular dropdowns (Admin e filtros OTW).
- Filtro OTW aplica-se a candidatos cuja **empresa de origem** tenha o segmento/subsegmento selecionado (ver A-03).
- Colunas **Segmento** e **Subsegmento** na **lista/tabela** Open to Work, preenchidas com os valores da **empresa ligada ao funcionario/candidato** (nao campos do employee).
- A listagem OTW **nao** exibe o nome (nem identificador) da empresa do candidato.
- Documentacao minima (SPEC + design na fase seguinte; README/CHANGELOG na fase de docs).

### 4.2 Fora de escopo

- Tornar Segmento ou Subsegmento obrigatorios na Empresa.
- Cadastro de Segmento/Subsegmento por COMPANY_ADMIN ou outros perfis (somente ADMIN).
- Exibir coluna ou dado de **Empresa** na listagem Open to Work.
- Filtros de segmento/subsegmento em outras telas (Painel, pesquisas, etc.).
- Importacao em massa / seed inicial de segmentos.
- Historico de alteracao de segmento da empresa.
- `@clamed/logger` e `light-node-metrics` neste MVP (**Nao** — decisao do gate Node).

### 4.3 Premissas e dependencias

- **Premissas:** ver secao 16 (A-xx).
- **Dependencias:** padrao CRUD Admin da plataforma; endpoint Open to Work existente (`GET /companies/employees/open-to-work`); regras vigentes de elegibilidade OTW e escopo COMPANY_ADMIN (ex.: exclusao da propria empresa, se ja entregue).
- **Gate Node (`@clamed/logger` / `light-node-metrics`):** **Nao — nenhum neste MVP** (opcao 4). Explicitamente fora de escopo.

## 5. Glossario

| Termo | Definicao de negocio |
|-------|----------------------|
| Segmento | Classificacao macro de mercado da empresa (ex.: Varejo, Industria) |
| Subsegmento | Classificacao mais especifica dentro de um Segmento (ex.: Varejo farmaceutico, Industria de minerios) |
| Open to Work (OTW) | Listagem de candidatos disponiveis para contratacao, usada pelo COMPANY_ADMIN |
| Admin | Usuario tipo ADMIN; acesso aos cadastros da plataforma |
| Company Admin | Usuario tipo COMPANY_ADMIN; acesso ao Open to Work de RH |

## 6. Regras de negocio (RN)

| ID | Regra | Obrigatoria? |
|----|-------|--------------|
| RN-01 | Somente ADMIN pode criar, editar, listar e remover Segmentos e Subsegmentos. | Sim |
| RN-02 | Segmento possui nome obrigatorio, unico (case-insensitive). | Sim |
| RN-03 | Subsegmento possui nome obrigatorio; cada Subsegmento pertence a exatamente um Segmento; o par (Segmento, nome) e unico (case-insensitive). | Sim |
| RN-04 | Na Empresa, Segmento e Subsegmento sao **opcionais** (podem ficar ambos vazios). | Sim |
| RN-05 | Se a Empresa tiver Subsegmento preenchido, o Segmento da Empresa deve ser o Segmento pai desse Subsegmento (consistencia). | Sim |
| RN-06 | Nao e permitido remover Segmento que possua Subsegmentos vinculados (bloquear com mensagem de negocio). | Sim |
| RN-07 | Nao e permitido remover Segmento ou Subsegmento que esteja associado a pelo menos uma Empresa (bloquear com mensagem de negocio). | Sim |
| RN-08 | No Open to Work, filtros Segmento e Subsegmento sao opcionais e combinam com os demais filtros ja existentes (AND). | Sim |
| RN-09 | Filtro por Segmento no OTW restringe a candidatos cuja empresa de origem tenha aquele Segmento. | Sim |
| RN-10 | Filtro por Subsegmento no OTW restringe a candidatos cuja empresa de origem tenha aquele Subsegmento. | Sim |
| RN-11 | Se Segmento e Subsegmento forem filtrados juntos e o Subsegmento nao pertencer ao Segmento, o sistema nao retorna resultados incoerentes: ou limpa/impede a combinacao invalida na UI, ou retorna lista vazia de forma previsivel (ver A-04). | Sim |
| RN-12 | COMPANY_ADMIN nao cadastra Segmento/Subsegmento; apenas consome as opcoes nos dropdowns do OTW. | Sim |
| RN-13 | Na listagem Open to Work, cada linha exibe **Segmento** e **Subsegmento** da empresa vinculada ao funcionario/candidato. Se a empresa nao tiver valor, a celula fica vazia. | Sim |
| RN-14 | A listagem Open to Work **nao** exibe nome nem identificador da empresa do candidato. | Sim |

## 7. Requisitos funcionais (RF / FRD)

| ID | Requisito | Prioridade (MoSCoW) | RNs relacionados |
|----|-----------|---------------------|------------------|
| RF-01 | O sistema deve oferecer telas Admin de listagem/cadastro/edicao/exclusao de Segmento. | Must | RN-01, RN-02, RN-06, RN-07 |
| RF-02 | O sistema deve oferecer telas Admin de listagem/cadastro/edicao/exclusao de Subsegmento, com selecao do Segmento pai. | Must | RN-01, RN-03, RN-06, RN-07 |
| RF-03 | O sistema deve permitir informar Segmento e/ou Subsegmento no cadastro/edicao de Empresa (campos nao obrigatorios). | Must | RN-04, RN-05 |
| RF-04 | No cadastro de Empresa, ao escolher Subsegmento, o Segmento deve alinhar-se ao pai do Subsegmento (auto-preencher ou validar). | Must | RN-05 |
| RF-05 | No Open to Work do COMPANY_ADMIN, o sistema deve exibir dropdowns de Segmento e Subsegmento (opcoes vindas dos cadastros). | Must | RN-08, RN-12 |
| RF-06 | Ao aplicar filtro de Segmento e/ou Subsegmento no OTW, a listagem deve refletir RN-09/RN-10. | Must | RN-08–RN-11 |
| RF-07 | APIs de Segmento e Subsegmento devem estar protegidas para escrita/CRUD Admin; listagens usadas por dropdown OTW devem ser acessiveis ao COMPANY_ADMIN autenticado (somente leitura). | Must | RN-01, RN-12 |
| RF-08 | A resposta/listagem OTW deve incluir Segmento e Subsegmento (nomes) da empresa do candidato para exibicao em colunas da tabela. | Must | RN-13 |
| RF-09 | A UI OTW nao deve renderizar coluna de Empresa. | Must | RN-14 |

## 8. Requisitos nao funcionais (RNF)

| ID | Categoria | Requisito | Criterio / metrica |
|----|-----------|-----------|--------------------|
| RNF-01 | Seguranca | Mutacoes de Segmento/Subsegmento apenas ADMIN | Tentativa COMPANY_ADMIN em POST/PUT/DELETE → negado (403/401 conforme padrao do projeto) |
| RNF-02 | Usabilidade | Filtros OTW de segmento/subsegmento sao dropdown (nao texto livre) | UI usa selecao de lista; clearable |
| RNF-03 | Consistencia | Unicidade de nomes conforme RN-02/RN-03 | Tentativa de duplicata → erro de negocio claro |
| RNF-04 | Observabilidade | Sem novos pacotes `@clamed/logger` / `light-node-metrics` | Nao adicionar dependencias desses pacotes neste MVP |

## 9. User stories e criterios de aceite (Gherkin)

### US-01 — Cadastrar Segmento (Admin)

**Como** ADMIN, **quero** cadastrar segmentos de mercado, **para** classificar empresas.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-01 | **Dado** ADMIN autenticado **Quando** cria Segmento com nome valido e unico **Entao** o Segmento aparece na listagem | RF-01, RN-01, RN-02 |
| CA-02 | **Dado** Segmento com nome "Varejo" **Quando** tenta criar outro "varejo" **Entao** o sistema rejeita por duplicidade | RF-01, RN-02 |

### US-02 — Cadastrar Subsegmento (Admin)

**Como** ADMIN, **quero** cadastrar subsegmentos vinculados a um segmento, **para** detalhar o mercado.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-03 | **Dado** Segmento "Industria" **Quando** ADMIN cria Subsegmento "Minerios" nesse Segmento **Entao** o Subsegmento fica listado sob esse Segmento | RF-02, RN-03 |
| CA-04 | **Dado** Subsegmento vinculado **Quando** ADMIN tenta remover o Segmento pai **Entao** a remocao e bloqueada | RF-01, RN-06 |

### US-03 — Associar Segmento/Subsegmento a Empresa

**Como** ADMIN, **quero** informar segmento e subsegmento opcionais na empresa, **para** classifica-la sem obrigar preenchimento.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-05 | **Dado** cadastro de Empresa **Quando** salva sem Segmento e sem Subsegmento **Entao** a Empresa e salva com sucesso | RF-03, RN-04 |
| CA-06 | **Dado** Subsegmento de Segmento A **Quando** ADMIN associa esse Subsegmento a Empresa **Entao** o Segmento da Empresa fica consistente com o pai (A) | RF-03, RF-04, RN-05 |
| CA-07 | **Dado** Empresa com Segmento/Subsegmento **Quando** ADMIN tenta remover o Subsegmento usado **Entao** a remocao e bloqueada | RF-02, RN-07 |

### US-04 — Filtrar e visualizar Segmento/Subsegmento no Open to Work

**Como** COMPANY_ADMIN, **quero** filtrar e ver segmento/subsegmento dos candidatos Open to Work (da empresa do funcionario, sem ver a empresa), **para** achar e avaliar perfis por mercado.

| ID | Criterio (Given / When / Then) | RFs / RNs |
|----|--------------------------------|-----------|
| CA-08 | **Dado** COMPANY_ADMIN na tela OTW **Quando** abre o filtro Segmento **Entao** ve dropdown com segmentos cadastrados (nao campo texto livre) | RF-05, RNF-02, RN-12 |
| CA-09 | **Dado** empresas classificadas e candidatos OTW elegiveis **Quando** filtra por Segmento X **Entao** so aparecem candidatos cuja empresa de origem tem Segmento X | RF-06, RN-09 |
| CA-10 | **Dado** filtro Subsegmento Y **Quando** aplica **Entao** so aparecem candidatos cuja empresa de origem tem Subsegmento Y | RF-06, RN-10 |
| CA-11 | **Dado** candidato cuja empresa tem Segmento "Varejo" e Subsegmento "Farmaceutico" **Quando** COMPANY_ADMIN ve a lista OTW **Entao** as colunas Segmento e Subsegmento mostram esses valores **e** nao ha coluna/dado de Empresa | RF-08, RF-09, RN-13, RN-14 |
| CA-12 | **Dado** candidato cuja empresa nao tem Segmento/Subsegmento **Quando** lista OTW **Entao** as colunas Segmento/Subsegmento ficam vazias e demais dados do candidato permanecem | RF-08, RN-13 |

## 10. Fluxos / casos de uso principais

### Fluxo: Cadastro Admin de Segmento/Subsegmento (UC-01)

- **Ator primario:** ADMIN
- **Pre-condicoes:** ADMIN autenticado; menu Cadastros disponivel
- **Fluxo basico (passos):**
  1. Acessa Cadastro de Segmento → cria/edita nome → salva.
  2. Acessa Cadastro de Subsegmento → escolhe Segmento pai → informa nome → salva.
  3. Lista e remove quando nao houver vinculos bloqueantes.
- **Fluxos alternativos:** edicao de nome mantendo unicidade.
- **Fluxos de excecao:** duplicidade; remocao com vinculos (RN-06/RN-07).
- **Pos-condicoes:** opcoes disponiveis para Empresa e dropdowns OTW.

### Fluxo: Classificar Empresa (UC-02)

- **Ator primario:** ADMIN
- **Pre-condicoes:** Segmentos/Subsegmentos cadastrados (opcional para deixar em branco)
- **Fluxo basico:** edita Empresa → seleciona Segmento e/ou Subsegmento → salva.
- **Fluxos de excecao:** inconsistencia Segmento×Subsegmento → rejeita ou corrige (RN-05).
- **Pos-condicoes:** Empresa classificada para filtros OTW.

### Fluxo: Filtrar e listar OTW (UC-03)

- **Ator primario:** COMPANY_ADMIN
- **Pre-condicoes:** autenticado; tela Open to Work
- **Fluxo basico:**
  1. Visualiza tabela com colunas incluindo Segmento e Subsegmento (origem: empresa do funcionario).
  2. Seleciona Segmento e/ou Subsegmento nos dropdowns → aplica/atualiza listagem.
- **Fluxos alternativos:** limpar filtros; combinar com cargo/area/cidade/estado se existirem.
- **Pos-condicoes:** lista filtrada conforme RN-08–RN-10; sem coluna Empresa (RN-14).

## 11. Excecoes e erros de negocio

| Situacao | Comportamento esperado | Mensagem / codigo (se houver) |
|----------|------------------------|-------------------------------|
| Nome de Segmento duplicado | Nao salva | Mensagem clara de nome ja existente |
| Nome de Subsegmento duplicado no mesmo Segmento | Nao salva | Mensagem clara de duplicidade no segmento |
| Remover Segmento com Subsegmentos | Bloqueia | Informar que ha subsegmentos vinculados |
| Remover Segmento/Subsegmento com Empresas | Bloqueia | Informar que ha empresas vinculadas |
| Empresa com Subsegmento de outro Segmento | Bloqueia ou corrige | Inconsistencia de classificacao |
| COMPANY_ADMIN tenta mutar cadastros | Negado | 403/401 padrao |
| Filtro OTW sem matches | Lista vazia | Sem erro; UX de “sem resultados” padrao da tela |

## 12. Dados de negocio

| Entidade | Atributos criticos | Regras / validade |
|----------|--------------------|-------------------|
| Segmento | id, nome | Nome unico (case-insensitive); obrigatorio |
| Subsegmento | id, nome, segmento (pai) | Nome unico por segmento; pai obrigatorio |
| Empresa | …existentes, segmento (opcional), subsegmento (opcional) | RN-04, RN-05 |
| Candidato OTW (linha da lista) | …existentes + segmento (nome) + subsegmento (nome) via empresa do funcionario; **sem** nome/id da empresa | RN-09, RN-10, RN-13, RN-14 |

## 13. Integracoes (se houver)

N/A — sem sistemas externos neste MVP.

## 14. Rastreabilidade (minima)

| User story | RFs | RNs | Criterios de aceite |
|------------|-----|-----|---------------------|
| US-01 | RF-01 | RN-01, RN-02, RN-06, RN-07 | CA-01, CA-02 |
| US-02 | RF-02 | RN-01, RN-03, RN-06, RN-07 | CA-03, CA-04 |
| US-03 | RF-03, RF-04 | RN-04, RN-05, RN-07 | CA-05, CA-06, CA-07 |
| US-04 | RF-05, RF-06, RF-07, RF-08, RF-09 | RN-08–RN-14 | CA-08–CA-12 |

## 15. Cenarios de validacao de regra de negocio (fase dedicada pos-review)

| ID | Cenario | Entrada | Resultado esperado | RN/RF |
|----|---------|---------|--------------------|-------|
| VAL-01 | Criar Segmento unico | nome "Varejo" | criado e listado | RN-02, RF-01 |
| VAL-02 | Duplicar Segmento | "varejo" apos "Varejo" | rejeitado | RN-02 |
| VAL-03 | Criar Subsegmento com pai | Segmento Industria + "Minerios" | criado | RN-03, RF-02 |
| VAL-04 | Remover Segmento com filhos | Segmento com subsegmentos | bloqueado | RN-06 |
| VAL-05 | Empresa sem classificacao | salvar sem segmento/sub | sucesso | RN-04, CA-05 |
| VAL-06 | Empresa com subsegmento | escolher sub | segmento consistente | RN-05, CA-06 |
| VAL-07 | Remover sub usado por empresa | delete sub | bloqueado | RN-07, CA-07 |
| VAL-08 | OTW filtro segmento dropdown | selecionar segmento X | so empresas com X | RN-09, CA-08, CA-09 |
| VAL-09 | OTW filtro subsegmento | selecionar sub Y | so empresas com Y | RN-10, CA-10 |
| VAL-10 | COMPANY_ADMIN nao muta cadastro | POST segmento | negado | RN-01, RN-12, RF-07 |
| VAL-11 | Colunas Segmento/Subsegmento na lista OTW | empresa do employee classificada | nomes corretos nas colunas; sem coluna Empresa | RN-13, RN-14, CA-11 |
| VAL-12 | Empresa sem classificacao na lista OTW | company sem segmento/sub | celulas vazias | RN-13, CA-12 |

### Resultados da execucao (2026-07-22)

Execucao via API local (`localhost:3334`) com usuarios de teste Admin / Company Admin.

| ID | Resultado | Evidencia |
|----|----------|-----------|
| VAL-01 | **PASS** | Segmento "Varejo" listado (`58a93d25-…`) |
| VAL-02 | **PASS** | POST `varejo` → 400 `Segment already exists` |
| VAL-03 | **PASS** | Subsegmento "Minerios" criado em Industria (201) |
| VAL-04 | **PASS** | DELETE Industria → 400 com subsegmentos vinculados |
| VAL-05 | **PASS** | POST company sem FKs → 201, `segmentId=null` |
| VAL-06 | **PASS** | POST com só `subsegmentId` → `segmentId` preenchido com o pai |
| VAL-07 | **PASS** | DELETE sub usado → 400 empresas vinculadas |
| VAL-08 | **PASS** | OTW `?segmentId=Industria` → 173 linhas, todas `segmentName=Industria` |
| VAL-09 | **PASS** | OTW `?subsegmentId=Minerios` → 173 linhas, todas `subsegmentName=Minerios` |
| VAL-10 | **PASS** | COMPANY_ADMIN POST `/segments` → 400 `User is not admin` (mutação negada; GET listagem 200) |
| VAL-11 | **PASS** | OTW 861 itens; payload sem `company`/`companyId`; campos `segmentName`/`subsegmentName` |
| VAL-12 | **PASS** | Amostra sem classificação → `segmentName=null`, `subsegmentName=null` |

**Resumo:** 12/12 PASS. UI Admin (listagens/CRUD/filtros OTW) validada pelo solicitante antes desta fase.

## 16. Assumptions e perguntas abertas

| ID | Tipo (assumption / pergunta) | Texto | Impacto se errado |
|----|------------------------------|-------|-------------------|
| A-01 | assumption | Subsegmento **sempre** pertence a um Segmento (CRUD separado, mas hierarquico). | Alto — muda modelo e UI |
| A-02 | assumption | No formulario de Empresa, ao selecionar Subsegmento o Segmento e auto-preenchido com o pai; ao limpar Segmento, limpa Subsegmento. | Medio |
| A-03 | assumption | Filtro **e** colunas OTW usam a classificacao da **empresa do colaborador candidato** (company do employee), nao a empresa do COMPANY_ADMIN logado. | Alto |
| A-04 | assumption | No OTW, ao mudar Segmento no dropdown, as opcoes de Subsegmento sao filtradas pelo Segmento (cascade); clearable em ambos. | Medio |
| A-05 | assumption | Unicidade de nomes e case-insensitive. | Baixo |
| A-06 | assumption | Listagem read-only de Segmento/Subsegmento para popular dropdown OTW e permitida a COMPANY_ADMIN autenticado. | Medio |
| Q-01 | pergunta | Confirma A-01 (subsegmento exige segmento pai)? Se forem independentes, avise. | Alto |

## 17. Historico de revisao

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 0.1 | 2026-07-22 | Agent Pro | Rascunho inicial; gate Node = Nao |
| 0.2 | 2026-07-22 | Agent Pro | Colunas Segmento/Subsegmento na lista OTW (empresa do funcionario); sem exibir Empresa |
| 0.2.1 | 2026-07-22 | Agent Pro | Status aprovado — seguir para arquitetura |
| 0.3 | 2026-07-22 | Agent Pro | Resultados VAL-01…12 (12/12 PASS) |
| 0.4 | 2026-07-22 | Agent Pro | Status verificado; docs README/CHANGELOG |
