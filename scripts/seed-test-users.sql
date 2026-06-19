-- Usuários de teste do Prepara.me
-- Senha de login de todos: Teste@123
-- Reaplicar: psql -h localhost -U postgres -d preparame -f scripts/seed-test-users.sql

BEGIN;

DELETE FROM "companyPage"
WHERE id = 'a1000000-0000-4000-8000-000000000020';

DELETE FROM "companyEmployees"
WHERE email IN (
    'teste.colaborador1@prepara.me',
    'teste.colaborador2@prepara.me',
    'teste.colaborador3@prepara.me',
    'teste.pendente@prepara.me'
);

DELETE FROM specialists
WHERE id = 'a1000000-0000-4000-8000-000000000112';

DELETE FROM users
WHERE email IN (
    'teste.admin@prepara.me',
    'teste.especialista@prepara.me',
    'teste.empresa@prepara.me',
    'teste.colaborador1@prepara.me',
    'teste.colaborador2@prepara.me',
    'teste.colaborador3@prepara.me'
);

DELETE FROM "companySubscriptionPlans"
WHERE id = 'a1000000-0000-4000-8000-000000000010';

DELETE FROM companies
WHERE id = 'a1000000-0000-4000-8000-000000000001';

INSERT INTO companies (id, name)
VALUES ('a1000000-0000-4000-8000-000000000001', 'Empresa Teste Prepara.me');

INSERT INTO "companyPage" (
    id, "companyId", name, vacancies, "expirationDate", logo, text,
    "backgroundColor", "containerColor", "clockColor", "textColor", active, "logoInternal"
)
VALUES (
    'a1000000-0000-4000-8000-000000000020',
    'a1000000-0000-4000-8000-000000000001',
    'Empresa Teste Prepara.me',
    100,
    NOW() + INTERVAL '365 days',
    'test-logo.png',
    'Empresa criada para testes locais do Prepara.me.',
    '#ffffff',
    '#0066cc',
    '#0066cc',
    '#000000',
    true,
    'test-logo-internal.png'
);

INSERT INTO "companySubscriptionPlans" (
    id,
    "companyId",
    "subscriptionPlanId",
    "startDate",
    "endDate",
    "subscribeToken"
)
VALUES (
    'a1000000-0000-4000-8000-000000000010',
    'a1000000-0000-4000-8000-000000000001',
    'e1d2027f-2a1f-4bbb-a19f-90d2ee793bb3',
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '365 days',
    'TESTE-PREPARA-2026'
);

INSERT INTO users (
    id, name, username, password, email, "documentId", type, status,
    "laborRisk", "NPSSurvey", "surveyAnswered", "companyId", realocated,
    "laborRiskAlert", "expiresDate", "periodTest", "subscribeToken", "companyNameSignIn"
) VALUES
(
    'a1000000-0000-4000-8000-000000000101',
    'Admin Teste',
    'admin.teste',
    '$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq',
    'teste.admin@prepara.me',
    '11111111111',
    'ADMIN',
    'ACTIVE',
    0, 0, false, NULL, 'NOT_REALOCATED', 'NORMAL', NULL,
    NOW() + INTERVAL '30 days', NULL, NULL
),
(
    'a1000000-0000-4000-8000-000000000102',
    'Especialista Teste',
    'especialista.teste',
    '$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq',
    'teste.especialista@prepara.me',
    '22222222222',
    'SPECIALIST',
    'ACTIVE',
    0, 0, false, NULL, 'NOT_REALOCATED', 'NORMAL', NULL,
    NOW() + INTERVAL '30 days', NULL, NULL
),
(
    'a1000000-0000-4000-8000-000000000103',
    'Admin Empresa Teste',
    'empresa.admin.teste',
    '$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq',
    'teste.empresa@prepara.me',
    '33333333333',
    'COMPANY_ADMIN',
    'ACTIVE',
    0, 0, false, 'a1000000-0000-4000-8000-000000000001', 'NOT_REALOCATED', 'NORMAL', NULL,
    NOW() + INTERVAL '30 days', 'TESTE-PREPARA-2026', 'Empresa Teste Prepara.me'
),
(
    'a1000000-0000-4000-8000-000000000201',
    'Colaborador Teste 1',
    'colaborador1.teste',
    '$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq',
    'teste.colaborador1@prepara.me',
    '44444444444',
    'USER',
    'ACTIVE',
    0, 0, false, 'a1000000-0000-4000-8000-000000000001', 'NOT_REALOCATED', 'NORMAL', NULL,
    NOW() + INTERVAL '30 days', 'TESTE-PREPARA-2026', 'Empresa Teste Prepara.me'
),
(
    'a1000000-0000-4000-8000-000000000202',
    'Colaborador Teste 2',
    'colaborador2.teste',
    '$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq',
    'teste.colaborador2@prepara.me',
    '55555555555',
    'USER',
    'ACTIVE',
    0, 0, false, 'a1000000-0000-4000-8000-000000000001', 'NOT_REALOCATED', 'NORMAL', NULL,
    NOW() + INTERVAL '30 days', 'TESTE-PREPARA-2026', 'Empresa Teste Prepara.me'
),
(
    'a1000000-0000-4000-8000-000000000203',
    'Colaborador Teste 3',
    'colaborador3.teste',
    '$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq',
    'teste.colaborador3@prepara.me',
    '66666666666',
    'USER',
    'ACTIVE',
    0, 0, false, 'a1000000-0000-4000-8000-000000000001', 'NOT_REALOCATED', 'NORMAL', NULL,
    NOW() + INTERVAL '30 days', 'TESTE-PREPARA-2026', 'Empresa Teste Prepara.me'
);

INSERT INTO specialists (id, name, bio, status, "linkedinUrl", "userId")
VALUES (
    'a1000000-0000-4000-8000-000000000112',
    'Especialista Teste',
    'Perfil de especialista criado para testes locais.',
    'ACTIVE',
    'https://www.linkedin.com/in/teste',
    'a1000000-0000-4000-8000-000000000102'
);

INSERT INTO "companyEmployees" (
    id, "companyId", name, "documentId", "subscribeToken", phone, email,
    "userId", "easyRegister", accepted, realocate, "entryDate",
    position, department, plan, unity, "packageDeclined", "manualCompany"
) VALUES
(
    'a1000000-0000-4000-8000-000000000301',
    'a1000000-0000-4000-8000-000000000001',
    'Colaborador Teste 1',
    '44444444444',
    'TESTE-PREPARA-2026',
    '11999990001',
    'teste.colaborador1@prepara.me',
    'a1000000-0000-4000-8000-000000000201',
    'NO', true, false, NOW() - INTERVAL '180 days',
    'Analista', 'Operações', 'DEMO TESTE', 'Matriz', false, ''
),
(
    'a1000000-0000-4000-8000-000000000302',
    'a1000000-0000-4000-8000-000000000001',
    'Colaborador Teste 2',
    '55555555555',
    'TESTE-PREPARA-2026',
    '11999990002',
    'teste.colaborador2@prepara.me',
    'a1000000-0000-4000-8000-000000000202',
    'NO', true, false, NOW() - INTERVAL '120 days',
    'Coordenador', 'RH', 'DEMO TESTE', 'Matriz', false, ''
),
(
    'a1000000-0000-4000-8000-000000000303',
    'a1000000-0000-4000-8000-000000000001',
    'Colaborador Teste 3',
    '66666666666',
    'TESTE-PREPARA-2026',
    '11999990003',
    'teste.colaborador3@prepara.me',
    'a1000000-0000-4000-8000-000000000203',
    'NO', true, false, NOW() - INTERVAL '60 days',
    'Assistente', 'Financeiro', 'DEMO TESTE', 'Filial SP', false, ''
),
(
    'a1000000-0000-4000-8000-000000000304',
    'a1000000-0000-4000-8000-000000000001',
    'Colaborador Pendente',
    '77777777777',
    'TESTE-PREPARA-2026',
    '11999990004',
    'teste.pendente@prepara.me',
    NULL,
    'YES', false, false, NOW() - INTERVAL '15 days',
    'Estagiário', 'TI', 'DEMO TESTE', 'Matriz', false, ''
);

COMMIT;
