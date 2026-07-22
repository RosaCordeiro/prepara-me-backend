# Changelog

Mudanças notáveis da API `prepara-me-backend`.

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Unreleased]

### Added

- Melhorias Open to Work (`GET /companies/employees/open-to-work`): filtros `position`, `department`, `city`, `state`; `excludeCompanyId` para COMPANY_ADMIN (outras empresas).
- Spec/design: `docs/desenvolvimento/especificacoes/2026-07-21-rh-open-to-work-melhorias.md` (+ `-design.md`).
- Limiar de anonimato para `COMPANY_ADMIN` em relatórios NPS (`SURVEY_ANONYMITY_MIN_RESPONDENTS`, default 5).
- Flag de contrato `insufficientSample` (substitui `lessThanFive`).
- Spec/design: `docs/desenvolvimento/especificacoes/2026-07-21-rh-anonimato-limite-amostra.md` (+ `-design.md`).
- Testes unitários: `NPSSurveyAnswersUseCase.spec.ts` (6 casos).

### Changed

- Open to Work **não** exige mais `linkedinUrl`; exclui realocados; permissão default permitir (`NULL` ou `true`).
- Métricas omitidas por amostra insuficiente passam a retornar **`Sem informações`** (em vez de `N/A`).
- `COMPANY_ADMIN` deixa de bypassar o limiar; `EXCEPTION_COMPANY_IDS` não isenta o RH.
- Script `scripts/test-dashboard-rh-data.js` alinhado ao novo contrato.

### Removed

- Campo JSON `lessThanFive`.
- Alias `shouldCheckSurveyLimit`.
- Exigência de LinkedIn preenchido na query Open to Work.
