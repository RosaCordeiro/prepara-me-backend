# Changelog

Mudanças notáveis da API `prepara-me-backend`.

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Unreleased]

### Added

- Limiar de anonimato para `COMPANY_ADMIN` em relatórios NPS (`SURVEY_ANONYMITY_MIN_RESPONDENTS`, default 5).
- Flag de contrato `insufficientSample` (substitui `lessThanFive`).
- Spec/design: `docs/desenvolvimento/especificacoes/2026-07-21-rh-anonimato-limite-amostra.md` (+ `-design.md`).
- Testes unitários: `NPSSurveyAnswersUseCase.spec.ts` (6 casos).

### Changed

- Métricas omitidas por amostra insuficiente passam a retornar **`Sem informações`** (em vez de `N/A`).
- `COMPANY_ADMIN` deixa de bypassar o limiar; `EXCEPTION_COMPANY_IDS` não isenta o RH.
- Script `scripts/test-dashboard-rh-data.js` alinhado ao novo contrato.

### Removed

- Campo JSON `lessThanFive`.
- Alias `shouldCheckSurveyLimit`.
