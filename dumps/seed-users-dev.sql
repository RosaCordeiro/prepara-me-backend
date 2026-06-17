-- Seed de usuários para ambiente de desenvolvimento - Prepara.me
-- Senha padrão de todos os usuários: Prepara@123
-- Hash bcrypt (8 rounds): $2a$08$qQ7KQOrMcmr3qGwNqa1UWe8gta7xzYdbFWvYmCmUAOY6IAMUMh2OK
--
-- Tipos disponíveis: ADMIN | USER | SPECIALIST | COMPANY_ADMIN
-- Login na API: POST /sessions  { "email": "...", "password": "..." }
--
-- companyNameSignIn = slug da companyPage (ex.: preparame-demo), NÃO o nome da empresa.
-- Usuários com companyId resolvem logo via companyPage.companyId no login.
--
-- Para reexecutar do zero, descomente o bloco abaixo:
-- DELETE FROM specialists WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
-- DELETE FROM users WHERE email LIKE '%@preparame.local';
-- DELETE FROM "companyPage" WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
-- DELETE FROM companies WHERE id = '11111111-1111-1111-1111-111111111111';
--
-- Limpar slugs inválidos em banco já existente:
--   psql "$DATABASE_URL" -f dumps/fix-company-name-sign-in.sql

BEGIN;

-- Empresa base (necessária para USER e COMPANY_ADMIN)
INSERT INTO companies (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'Prepara.me Demo');

-- Página de patrocínio (slug usado em cadastro/login patrocinado)
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
) VALUES (
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
);

-- ---------------------------------------------------------------------------
-- ADMIN
-- ---------------------------------------------------------------------------
INSERT INTO users (
    id, name, username, email, password, "documentId", type, status,
    "laborRisk", "NPSSurvey", "surveyAnswered", "companyId", realocated,
    "laborRiskAlert", "periodTest", "companyNameSignIn", created_at
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Admin Prepara.me',
    'admin.preparame',
    'admin@preparame.local',
    '$2a$08$qQ7KQOrMcmr3qGwNqa1UWe8gta7xzYdbFWvYmCmUAOY6IAMUMh2OK',
    '00000000001',
    'ADMIN',
    'ACTIVE',
    0, 0, false,
    NULL,
    'NOT_REALOCATED',
    'NORMAL',
    NOW() + INTERVAL '30 days',
    '',
    NOW()
);

-- ---------------------------------------------------------------------------
-- COMPANY_ADMIN (admin da empresa — logo via companyId, sem slug)
-- ---------------------------------------------------------------------------
INSERT INTO users (
    id, name, username, email, password, "documentId", type, status,
    "laborRisk", "NPSSurvey", "surveyAnswered", "companyId", realocated,
    "laborRiskAlert", "periodTest", "companyNameSignIn", created_at
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Admin Empresa Demo',
    'admin.empresa',
    'admin.empresa@preparame.local',
    '$2a$08$qQ7KQOrMcmr3qGwNqa1UWe8gta7xzYdbFWvYmCmUAOY6IAMUMh2OK',
    '00000000002',
    'COMPANY_ADMIN',
    'ACTIVE',
    0, 0, false,
    '11111111-1111-1111-1111-111111111111',
    'NOT_REALOCATED',
    'NORMAL',
    NOW() + INTERVAL '30 days',
    '',
    NOW()
);

-- ---------------------------------------------------------------------------
-- USER (colaborador — slug patrocínio + companyId)
-- ---------------------------------------------------------------------------
INSERT INTO users (
    id, name, username, email, password, "documentId", type, status,
    "laborRisk", "NPSSurvey", "surveyAnswered", "companyId", realocated,
    "laborRiskAlert", "periodTest", "companyNameSignIn", created_at
) VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Usuário Demo',
    'usuario.demo',
    'usuario@preparame.local',
    '$2a$08$qQ7KQOrMcmr3qGwNqa1UWe8gta7xzYdbFWvYmCmUAOY6IAMUMh2OK',
    '00000000003',
    'USER',
    'ACTIVE',
    0, 0, false,
    '11111111-1111-1111-1111-111111111111',
    'NOT_REALOCATED',
    'NORMAL',
    NOW() + INTERVAL '30 days',
    'preparame-demo',
    NOW()
);

-- ---------------------------------------------------------------------------
-- SPECIALIST (requer registro na tabela specialists)
-- ---------------------------------------------------------------------------
INSERT INTO users (
    id, name, username, email, password, "documentId", type, status,
    "laborRisk", "NPSSurvey", "surveyAnswered", "companyId", realocated,
    "laborRiskAlert", "periodTest", "companyNameSignIn", created_at
) VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Especialista Demo',
    'especialista.demo',
    'especialista@preparame.local',
    '$2a$08$qQ7KQOrMcmr3qGwNqa1UWe8gta7xzYdbFWvYmCmUAOY6IAMUMh2OK',
    '00000000004',
    'SPECIALIST',
    'ACTIVE',
    0, 0, false,
    NULL,
    'NOT_REALOCATED',
    'NORMAL',
    NOW() + INTERVAL '30 days',
    '',
    NOW()
);

INSERT INTO specialists (id, name, bio, status, "linkedinUrl", "userId")
VALUES (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Especialista Demo',
    'Perfil de especialista para testes locais.',
    'ACTIVE',
    'https://www.linkedin.com/in/especialista-demo',
    'dddddddd-dddd-dddd-dddd-dddddddddddd'
);

COMMIT;

-- Credenciais de acesso:
-- | Tipo          | E-mail                         | Senha       |
-- |---------------|--------------------------------|-------------|
-- | ADMIN         | admin@preparame.local          | Prepara@123 |
-- | COMPANY_ADMIN | admin.empresa@preparame.local  | Prepara@123 |
-- | USER          | usuario@preparame.local        | Prepara@123 |
-- | SPECIALIST    | especialista@preparame.local   | Prepara@123 |
--
-- Página patrocínio demo: slug preparame-demo
