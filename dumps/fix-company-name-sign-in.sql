-- Corrige companyNameSignIn inválido (slug inexistente ou nome de empresa no lugar do slug).
-- Seguro para reexecutar: só altera registros com slug que não existe em companyPage.
--
-- Uso:
--   psql "$DATABASE_URL" -f dumps/fix-company-name-sign-in.sql
-- ou, com docker-compose local:
--   docker compose exec -T postgres psql -U postgres -d preparame -f /path/fix-company-name-sign-in.sql

BEGIN;

-- Garante companyPage demo para a empresa seed (idempotente)
INSERT INTO "companyPage" (
    id,
    name,
    vacancies,
    "expirationDate",
    logo,
    "logoInternal",
    text,
    "backgroundColor",
    "containerColor",
    "clockColor",
    "textColor",
    "companyId",
    active
)
SELECT
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'preparame-demo',
    100,
    NOW() + INTERVAL '365 days',
    '',
    '',
    'Programa demo Prepara.me',
    '#ffffff',
    '#f5f5f5',
    '#333333',
    '#333333',
    '11111111-1111-1111-1111-111111111111',
    true
WHERE NOT EXISTS (
    SELECT 1
    FROM "companyPage"
    WHERE "companyId" = '11111111-1111-1111-1111-111111111111'
);

UPDATE users u
SET "companyNameSignIn" = ''
WHERE u."companyNameSignIn" IS NOT NULL
  AND u."companyNameSignIn" <> ''
  AND NOT EXISTS (
      SELECT 1
      FROM "companyPage" cp
      WHERE cp.name = u."companyNameSignIn"
  );

COMMIT;

-- Verificação (opcional):
-- SELECT email, type, "companyId", "companyNameSignIn" FROM users WHERE "companyNameSignIn" <> '';
