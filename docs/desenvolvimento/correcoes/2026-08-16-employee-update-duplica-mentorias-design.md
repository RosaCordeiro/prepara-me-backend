# System Design — Fix: edição de Funcionário duplica mentorias

**CORR:** [2026-08-16-employee-update-duplica-mentorias.md](./2026-08-16-employee-update-duplica-mentorias.md)  
**Branch:** `fix/employee-update-duplica-mentorias` (`prepara-me-backend`)  
**Status:** aprovado — pronto para desenvolvimento  
**Data:** 2026-08-16  
**Observabilidade:** N/A neste MVP (sem `@clamed/logger` / `light-node-metrics`)  
**Skills na implementação:** `backend`

---

## 1. Contexto e objetivos

- **Problema:** `POST /companies/:id/employees` no ramo update recria `userProductsAvailable` sempre que `planId` vem no body; a home soma créditos → mentoria duplicada.
- **Meta:** save de edição **sem mudança de plano** não altera saldo de mentoria.
- **NFR:** sem pacotes novos de observabilidade; mudança mínima e local; sem migração de dados neste MVP.

## 2. Recomendacao e alternativas

### Recomendada — Guard “plano inalterado” no update

No ramo `id` presente de `CreateCompanyEmployeeUseCase`:

1. Resolver o plano como hoje (`findById` / fallback por nome).
2. Atualizar `updateData.plan` com o nome resolvido (comportamento atual de metadado).
3. **Só** executar o loop `userProductsAvailableRepository.create` se o plano resolvido for **diferente** do plano já gravado no employee (`existingEmployee.plan`), normalizando comparação por nome (string trim).
4. Se plano igual (caso típico do CRUD RH, que sempre reenvia `planId`): **não criar** produtos.

**Por quê:** elimina a causa raiz com diff mínimo; preserve create intacto; permite concessão futura se alguém mudar o plano de propósito via API.

### Alternativa descartada — Nunca conceder produtos no update

| Prós | Contras |
|------|---------|
| Ainda mais simples | Bloqueia upgrade intencional de plano por API |
| | Mais rígido que o necessário para o sintoma |

Trade-off: a recomendada cobre o bug reportado (plano estável no edit) sem matar o caminho de troca de plano.

## 3. Visao de sistema

```text
[RH CRUD Funcionário] --POST body+planId--> [CreateCompanyEmployeeController]
        --> [CreateCompanyEmployeeUseCase]
              |-- create (!id): cria user + produtos do plano (inalterado)
              |-- update (id):
                    atualiza campos employee
                    se plan resolvido == plan atual --> NÃO cria produtos
                    se plan resolvido != plan atual --> cria produtos do novo plano
        --> [userProductsAvailable] / [companyEmployee]
[Home usuário] soma availableQuantity (inalterado)
```

Fronteira: **somente backend**. Front não entra no MVP.

## 4. Componentes e responsabilidades

| Componente | Faz | Não faz |
|------------|-----|---------|
| `CreateCompanyEmployeeUseCase` | Guard de concessão no update | Limpeza de duplicatas históricas |
| `UserProductsAvailableRepository` | Continua `create` simples | Upsert/UNIQUE (fora do MVP) |
| `CompanyEmployeesRegisterCrud.vue` | Sem mudança neste MVP | — |

## 5. Modelo de dados (alto nivel)

Sem mudança de schema.

- `company_employees.plan` — nome do plano (string)
- `user_products_available` — linhas de crédito (userId, productId, availableQuantity)

Consistência: mesma request/transação implícita do use case atual (sem nova unidade de trabalho).

## 6. Fluxos principais

| Fluxo | Comportamento |
|-------|----------------|
| Edit salva sem mudar plano | Atualiza ficha; **0** inserts em `userProductsAvailable` |
| Create com plano | Igual hoje: cria créditos uma vez |
| Update com plano diferente | Atualiza nome do plano + concede produtos do novo plano (uma vez por mudança) |

## 7. API / contratos

- Endpoint inalterado: `POST /companies/:id/employees`
- Contrato de request/response inalterado
- Mudança apenas de **efeito colateral** no update

## 8. Infra

N/A — sem Compose/env novos.

## 9. Estrutura de pastas / branch

- Branch já aberta: `fix/employee-update-duplica-mentorias`
- Arquivo a alterar: `src/modules/company/useCases/createCompanyEmployee/CreateCompanyEmployeeUseCase.ts`
- Doc: `docs/desenvolvimento/correcoes/2026-08-16-employee-update-duplica-mentorias*.md`

## 10. MVPs possíveis

- **MVP-1 (este):** guard “só concede se plano mudou”
- **Depois (fora):** saneamento de créditos já duplicados; omitir `planId` no front; UNIQUE/upsert

## 11. Riscos e decisoes abertas

| Risco | Mitigação |
|-------|-----------|
| Comparação de nome frágil (UUID vs nome) | Comparar sempre `resolvedPlan.name` com `existingEmployee.plan` (ambos nome) |
| Troca de plano empilha créditos do plano novo sem remover o antigo | Aceito neste MVP; documentado; limpeza = follow-up |
| Dados históricos já duplicados | Fora de escopo (CORR §7.5) |

**Dúvidas abertas:** nenhuma bloqueante para implementar MVP-1.

## 12. Plano de implementacao

1. Alterar guard no update em `CreateCompanyEmployeeUseCase` (`backend`)
2. Code review
3. V-01…V-04 (CORR §8)
4. Suite automatizada do backend
5. Docs / DoD

---

**Recomendação resumida:** no update, criar `userProductsAvailable` **somente** quando `resolvedPlan.name !== existingEmployee.plan`.
