#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { profiles } = require("./seed-test-company-profiles");

const COMPANY_ID = "a1000000-0000-4000-8000-000000000001";
const PASSWORD_HASH =
  "$2a$08$zwPI.8CipwYCC1fLbVmiD.n6r4CyQbOxuvZ0ExaIDL0lDroJYCJPq";
const SUBSCRIBE_TOKEN = "TESTE-PREPARA-2026";

const QUESTION_IDS = {
  q1: "b2000000-0000-4000-8000-000000000001",
  q2: "b2000000-0000-4000-8000-000000000002",
};

const collaborators = [
  {
    suffix: "201",
    employeeSuffix: "301",
    name: "Colaborador Teste 1",
    username: "colaborador1.teste",
    email: "teste.colaborador1@prepara.me",
    documentId: "44444444444",
    phone: "11999990001",
    position: "Analista de Operações",
    department: "Operações",
    unity: "Matriz SP",
    plan: "DEMO TESTE",
    entryDaysAgo: 540,
    dismissalType: "voluntary",
    gender: "Masculino",
    etnia: "Parda",
    pcd: false,
    city: "São Paulo",
    state: "SP",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Comunicação clara durante todo o processo." },
      { questionId: QUESTION_IDS.q2, answer: "Mentoria de carreira." },
    ],
  },
  {
    suffix: "202",
    employeeSuffix: "302",
    name: "Colaborador Teste 2",
    username: "colaborador2.teste",
    email: "teste.colaborador2@prepara.me",
    documentId: "55555555555",
    phone: "11999990002",
    position: "Coordenador de RH",
    department: "Recursos Humanos",
    unity: "Matriz SP",
    plan: "DEMO TESTE",
    entryDaysAgo: 480,
    dismissalType: "involuntary",
    gender: "Feminino",
    etnia: "Branca",
    pcd: false,
    city: "São Paulo",
    state: "SP",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Faltou empatia na conversa de desligamento." },
      { questionId: QUESTION_IDS.q2, answer: "Workshop de recolocação." },
    ],
  },
  {
    suffix: "203",
    employeeSuffix: "303",
    name: "Colaborador Teste 3",
    username: "colaborador3.teste",
    email: "teste.colaborador3@prepara.me",
    documentId: "66666666666",
    phone: "11999990003",
    position: "Assistente Financeiro",
    department: "Financeiro",
    unity: "Filial SP",
    plan: "DEMO TESTE",
    entryDaysAgo: 360,
    dismissalType: "involuntary",
    gender: "Masculino",
    etnia: "Preta",
    pcd: false,
    city: "Campinas",
    state: "SP",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Processo foi abrupto e sem aviso prévio." },
      { questionId: QUESTION_IDS.q2, answer: "Suporte psicológico." },
    ],
  },
  {
    suffix: "204",
    employeeSuffix: "304",
    name: "Maria Silva Costa",
    username: "maria.silva",
    email: "teste.colaborador4@prepara.me",
    documentId: "88888888881",
    phone: "21999990004",
    position: "Desenvolvedora Pleno",
    department: "Tecnologia",
    unity: "Matriz SP",
    plan: "DEMO TESTE",
    entryDaysAgo: 300,
    dismissalType: "voluntary",
    gender: "Feminino",
    etnia: "Parda",
    pcd: false,
    city: "Rio de Janeiro",
    state: "RJ",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Saída foi respeitosa e alinhada com meu plano." },
      { questionId: QUESTION_IDS.q2, answer: "Trilha técnica e certificações." },
    ],
  },
  {
    suffix: "205",
    employeeSuffix: "305",
    name: "João Pedro Santos",
    username: "joao.santos",
    email: "teste.colaborador5@prepara.me",
    documentId: "88888888882",
    phone: "21999990005",
    position: "Executivo Comercial",
    department: "Comercial",
    unity: "Filial RJ",
    plan: "DEMO TESTE",
    entryDaysAgo: 240,
    dismissalType: "involuntary",
    gender: "Masculino",
    etnia: "Branca",
    pcd: true,
    city: "Rio de Janeiro",
    state: "RJ",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Metas eram inatingíveis antes da demissão." },
      { questionId: QUESTION_IDS.q2, answer: "Acessibilidade no portal e atendimento humano." },
    ],
  },
  {
    suffix: "206",
    employeeSuffix: "306",
    name: "Ana Beatriz Lima",
    username: "ana.lima",
    email: "teste.colaborador6@prepara.me",
    documentId: "88888888883",
    phone: "11999990006",
    position: "Analista de Marketing",
    department: "Marketing",
    unity: "Matriz SP",
    plan: "DEMO TESTE",
    entryDaysAgo: 180,
    dismissalType: "voluntary",
    gender: "Feminino",
    etnia: "Amarela",
    pcd: false,
    city: "São Paulo",
    state: "SP",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Processo foi ok, mas poderia ser mais rápido." },
      { questionId: QUESTION_IDS.q2, answer: "Conteúdos sobre marca pessoal." },
    ],
  },
  {
    suffix: "207",
    employeeSuffix: "307",
    name: "Pedro Henrique Oliveira",
    username: "pedro.oliveira",
    email: "teste.colaborador7@prepara.me",
    documentId: "88888888884",
    phone: "19999990007",
    position: "Supervisor Logístico",
    department: "Logística",
    unity: "CD Campinas",
    plan: "DEMO TESTE",
    entryDaysAgo: 120,
    dismissalType: "involuntary",
    gender: "Masculino",
    etnia: "Parda",
    pcd: false,
    city: "Campinas",
    state: "SP",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Equipe foi avisada apenas no último dia." },
      { questionId: QUESTION_IDS.q2, answer: "Simulador de entrevistas." },
    ],
  },
  {
    suffix: "208",
    employeeSuffix: "308",
    name: "Fernanda Souza Mendes",
    username: "fernanda.mendes",
    email: "teste.colaborador8@prepara.me",
    documentId: "88888888885",
    phone: "31999990008",
    position: "Advogada Trabalhista",
    department: "Jurídico",
    unity: "Matriz SP",
    plan: "DEMO TESTE",
    entryDaysAgo: 90,
    dismissalType: "involuntary",
    gender: "Feminino",
    etnia: "Preta",
    pcd: false,
    city: "Belo Horizonte",
    state: "MG",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Houve inconsistências na rescisão." },
      { questionId: QUESTION_IDS.q2, answer: "Canal jurídico dedicado." },
    ],
  },
  {
    suffix: "209",
    employeeSuffix: "309",
    name: "Carlos Eduardo Rocha",
    username: "carlos.rocha",
    email: "teste.colaborador9@prepara.me",
    documentId: "88888888886",
    phone: "31999990009",
    position: "Operador de Produção",
    department: "Produção",
    unity: "Filial MG",
    plan: "DEMO TESTE",
    entryDaysAgo: 60,
    dismissalType: "involuntary",
    gender: "Masculino",
    etnia: "Indígena",
    pcd: true,
    city: "Contagem",
    state: "MG",
    surveyQuestion: null,
  },
  {
    suffix: "210",
    employeeSuffix: "310",
    name: "Juliana Aparecida Ferreira",
    username: "juliana.ferreira",
    email: "teste.colaborador10@prepara.me",
    documentId: "88888888887",
    phone: "81999990010",
    position: "Analista de Atendimento",
    department: "Customer Success",
    unity: "Filial NE",
    plan: "DEMO TESTE",
    entryDaysAgo: 25,
    dismissalType: "voluntary",
    gender: "Feminino",
    etnia: "Parda",
    pcd: false,
    city: "Recife",
    state: "PE",
    surveyQuestion: [
      { questionId: QUESTION_IDS.q1, answer: "Fui acolhida, mas senti falta de follow-up." },
      { questionId: QUESTION_IDS.q2, answer: "Grupo de networking regional." },
    ],
  },
];

const collaboratorEmails = collaborators.map((item) => item.email);

function sql(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function userId(suffix) {
  return `a1000000-0000-4000-8000-000000000${suffix}`;
}

function employeeId(suffix) {
  return `a1000000-0000-4000-8000-000000000${suffix}`;
}

function buildUserRow(collaborator) {
  const profile = profiles[collaborator.suffix];
  const surveyQuestion = collaborator.surveyQuestion
    ? JSON.stringify(
        collaborator.surveyQuestion.map((item) => ({
          questionId: item.questionId,
          answer: item.answer,
        }))
      )
    : null;

  return `(
    ${sql(userId(collaborator.suffix))},
    ${sql(collaborator.name)},
    ${sql(collaborator.username)},
    ${sql(PASSWORD_HASH)},
    ${sql(collaborator.email)},
    ${sql(collaborator.documentId)},
    'USER',
    'ACTIVE',
    ${profile.laborRisk},
    ${profile.NPSSurvey},
    ${profile.surveyAnswered},
    ${sql(COMPANY_ID)},
    ${sql(profile.realocated)},
    ${sql(profile.laborRiskAlert)},
    ${sql(profile.feelingsMapJSON)},
    ${profile.brandRisk},
    ${sql(profile.laborRiskJSON)},
    ${sql(profile.brandRiskJSON)},
    ${sql(surveyQuestion)},
    NOW() + INTERVAL '30 days',
    ${sql(SUBSCRIBE_TOKEN)},
    'Empresa Teste Prepara.me'
  )`;
}

function buildEmployeeRow(collaborator) {
  return `(
    ${sql(employeeId(collaborator.employeeSuffix))},
    ${sql(COMPANY_ID)},
    ${sql(collaborator.name)},
    ${sql(collaborator.documentId)},
    ${sql(SUBSCRIBE_TOKEN)},
    ${sql(collaborator.phone)},
    ${sql(collaborator.email)},
    ${sql(userId(collaborator.suffix))},
    'NO',
    true,
    ${profileRealocateFlag(collaborator.suffix)},
    NOW() - INTERVAL '${collaborator.entryDaysAgo} days',
    ${sql(collaborator.position)},
    ${sql(collaborator.department)},
    ${sql(collaborator.plan)},
    ${sql(collaborator.unity)},
    false,
    '',
    ${sql(collaborator.dismissalType)},
    ${sql(collaborator.gender)},
    ${sql(collaborator.etnia)},
    ${collaborator.pcd},
    ${sql(collaborator.city)},
    ${sql(collaborator.state)}
  )`;
}

function profileRealocateFlag(suffix) {
  return profiles[suffix].realocated === "REALOCATED" ? "true" : "false";
}

const deleteEmailsSql = [
  ...collaboratorEmails,
  "teste.pendente@prepara.me",
  "teste.admin@prepara.me",
  "teste.especialista@prepara.me",
  "teste.empresa@prepara.me",
]
  .map((email) => sql(email))
  .join(",\n    ");

const sqlContent = `-- Usuários de teste do Prepara.me
-- Senha de login de todos: Teste@123
-- Gerado por: node scripts/build-seed-test-users.js
-- Reaplicar: bash scripts/seed-test-users.sh

BEGIN;

DELETE FROM survey_questions
WHERE companyid = '${COMPANY_ID}';

DELETE FROM "companyPage"
WHERE id = 'a1000000-0000-4000-8000-000000000020';

DELETE FROM "companyEmployees"
WHERE email IN (
    ${deleteEmailsSql}
);

DELETE FROM specialists
WHERE id = 'a1000000-0000-4000-8000-000000000112';

DELETE FROM users
WHERE email IN (
    ${deleteEmailsSql}
);

DELETE FROM "companySubscriptionPlans"
WHERE id = 'a1000000-0000-4000-8000-000000000010';

DELETE FROM companies
WHERE id = '${COMPANY_ID}';

INSERT INTO companies (id, name)
VALUES ('${COMPANY_ID}', 'Empresa Teste Prepara.me');

INSERT INTO "companyPage" (
    id, "companyId", name, vacancies, "expirationDate", logo, text,
    "backgroundColor", "containerColor", "clockColor", "textColor", active, "logoInternal"
)
VALUES (
    'a1000000-0000-4000-8000-000000000020',
    '${COMPANY_ID}',
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
    '${COMPANY_ID}',
    'e1d2027f-2a1f-4bbb-a19f-90d2ee793bb3',
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '365 days',
    '${SUBSCRIBE_TOKEN}'
);

INSERT INTO survey_questions (id, companyid, questiontext)
VALUES
    ('${QUESTION_IDS.q1}', '${COMPANY_ID}', 'O que mais te ajudou durante o processo de demissão?'),
    ('${QUESTION_IDS.q2}', '${COMPANY_ID}', 'Qual apoio adicional você gostaria de receber da empresa?');

INSERT INTO users (
    id, name, username, password, email, "documentId", type, status,
    "laborRisk", "NPSSurvey", "surveyAnswered", "companyId", realocated,
    "laborRiskAlert", "feelingsMapJSON", "brandRisk", "laborRiskJSON",
    "brandRiskJSON", "surveyQuestion", "expiresDate", "subscribeToken", "companyNameSignIn"
) VALUES
(
    'a1000000-0000-4000-8000-000000000101',
    'Admin Teste',
    'admin.teste',
    ${sql(PASSWORD_HASH)},
    'teste.admin@prepara.me',
    '11111111111',
    'ADMIN',
    'ACTIVE',
    0, 0, false, NULL, 'NOT_REALOCATED', 'NORMAL', NULL, 0, NULL, NULL, NULL,
    NOW() + INTERVAL '30 days', NULL, NULL
),
(
    'a1000000-0000-4000-8000-000000000102',
    'Especialista Teste',
    'especialista.teste',
    ${sql(PASSWORD_HASH)},
    'teste.especialista@prepara.me',
    '22222222222',
    'SPECIALIST',
    'ACTIVE',
    0, 0, false, NULL, 'NOT_REALOCATED', 'NORMAL', NULL, 0, NULL, NULL, NULL,
    NOW() + INTERVAL '30 days', NULL, NULL
),
(
    'a1000000-0000-4000-8000-000000000103',
    'Admin Empresa Teste',
    'empresa.admin.teste',
    ${sql(PASSWORD_HASH)},
    'teste.empresa@prepara.me',
    '33333333333',
    'COMPANY_ADMIN',
    'ACTIVE',
    0, 0, false, '${COMPANY_ID}', 'NOT_REALOCATED', 'NORMAL', NULL, 0, NULL, NULL, NULL,
    NOW() + INTERVAL '30 days', '${SUBSCRIBE_TOKEN}', 'Empresa Teste Prepara.me'
),
${collaborators.map(buildUserRow).join(",\n")};

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
    position, department, plan, unity, "packageDeclined", "manualCompany",
    "dismissalType", gender, etnia, pcd, city, state
) VALUES
${collaborators.map(buildEmployeeRow).join(",\n")},
(
    'a1000000-0000-4000-8000-000000000311',
    '${COMPANY_ID}',
    'Colaborador Pendente',
    '77777777777',
    '${SUBSCRIBE_TOKEN}',
    '11999990011',
    'teste.pendente@prepara.me',
    NULL,
    'YES',
    false,
    false,
    NOW() - INTERVAL '15 days',
    'Estagiário',
    'Tecnologia',
    'DEMO TESTE',
    'Matriz SP',
    false,
    '',
    'involuntary',
    'Não informado',
    'Parda',
    false,
    'São Paulo',
    'SP'
);

COMMIT;
`;

const outputPath = path.join(__dirname, "seed-test-users.sql");
fs.writeFileSync(outputPath, sqlContent, "utf8");
console.log(`Gerado: ${outputPath}`);
console.log(`Colaboradores ativos: ${collaborators.length}`);
console.log(`Com pesquisa respondida: ${collaborators.filter((item) => profiles[item.suffix].surveyAnswered).length}`);
