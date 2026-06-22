/**
 * Perfis de pesquisa para colaboradores da Empresa Teste.
 * Usado por seed-test-users.sql via valores pré-calculados.
 */

const FEELINGS = [
  "Alíviado(a). Já queria sair da empresa.",
  "Surpreso(a). Não esperava pela demissão.",
  "Injustiçado(a). Minha demissão foi injusta.",
  "Bravo(a). Não concordo em como a demissão aconteceu.",
  "Desesperado(a). Preciso me recolocar urgente.",
  "Inseguro(a). Estou com a autoestima abalada com a demissão.",
  "Inseguro(a). Não sei quais os passos para me recolocar.",
  "Triste. Gostava muito do meu trabalho.",
  "Triste. Gostava muito da empresa.",
  "Triste. Gostava muito da minha equipe de trabalho.",
  "Indiferente. Nem feliz e nem triste.",
  "Indiferente. Ainda tentando entender tudo que aconteceu.",
];

const LABOR_QUESTIONS = [
  "O quanto você se sentia respeitado na empresa, de forma geral?",
  "O quanto você se sentia respeitado pelos seus líderes?",
  "O quanto você gostaria de voltar a trabalhar nesta empresa no futuro?",
  "O quanto você achou que seu processo de demissão foi respeitoso?",
  "O quanto você se sentia seguro fisicamente na empresa?",
  "O quanto você se sentia seguro emocionalmente na empresa?",
  "O quanto você gostava do pacote de benefícios e remuneração da empresa?",
];

function buildFeelings(checkedIndexes) {
  // Mesmo formato da pesquisa real (NPSSurvey): apenas sentimentos marcados.
  return JSON.stringify(
    checkedIndexes.map((index) => ({
      feeling: FEELINGS[index],
      checked: true,
      laborRiskCheck: false,
    }))
  );
}

function buildLaborRisk(answers, rescisaoCorrect) {
  const items = answers.map((answer, index) => ({
    index,
    question: LABOR_QUESTIONS[index],
    answer,
  }));

  items.push({
    index: 9,
    question: "Os cálculos da rescisão estão corretos?",
    answer: rescisaoCorrect ? 10 : 0,
  });

  return JSON.stringify(items);
}

function buildBrandRisk(nps) {
  return JSON.stringify([
    {
      index: 0,
      question:
        "O quanto você recomenda a empresa para seus amigos e familiares trabalharem?",
      answer: nps,
    },
  ]);
}

function avgLabor(answers) {
  return answers.reduce((sum, value) => sum + value, 0) / answers.length;
}

function profile({
  nps,
  laborAnswers,
  rescisaoCorrect,
  feelings,
  realocated,
}) {
  const laborRisk = avgLabor(laborAnswers);
  return {
    NPSSurvey: nps,
    brandRisk: nps,
    laborRisk: Number(laborRisk.toFixed(2)),
    surveyAnswered: true,
    laborRiskAlert: laborRisk <= 5 ? "ALERT" : "NORMAL",
    realocated,
    feelingsMapJSON: buildFeelings(feelings),
    laborRiskJSON: buildLaborRisk(laborAnswers, rescisaoCorrect),
    brandRiskJSON: buildBrandRisk(nps),
  };
}

const profiles = {
  "201": profile({
    nps: 9,
    laborAnswers: [9, 8, 9, 8, 9, 8, 9],
    rescisaoCorrect: true,
    feelings: [0, 7],
    realocated: "REALOCATED",
  }),
  "202": profile({
    nps: 6,
    laborAnswers: [5, 4, 4, 3, 5, 4, 4],
    rescisaoCorrect: true,
    feelings: [1, 2],
    realocated: "NOT_REALOCATED",
  }),
  "203": profile({
    nps: 3,
    laborAnswers: [3, 2, 3, 2, 4, 3, 2],
    rescisaoCorrect: false,
    feelings: [2, 3, 4],
    realocated: "NOT_REALOCATED",
  }),
  "204": profile({
    nps: 10,
    laborAnswers: [10, 9, 10, 9, 10, 9, 10],
    rescisaoCorrect: true,
    feelings: [0, 10],
    realocated: "REALOCATED",
  }),
  "205": profile({
    nps: 2,
    laborAnswers: [2, 2, 1, 2, 3, 2, 2],
    rescisaoCorrect: false,
    feelings: [3, 4, 5],
    realocated: "NOT_REALOCATED",
  }),
  "206": profile({
    nps: 7,
    laborAnswers: [7, 6, 7, 6, 8, 7, 6],
    rescisaoCorrect: true,
    feelings: [1, 10, 11],
    realocated: "NOT_REALOCATED",
  }),
  "207": profile({
    nps: 8,
    laborAnswers: [8, 7, 8, 7, 8, 7, 8],
    rescisaoCorrect: true,
    feelings: [1, 7, 9],
    realocated: "REALOCATED",
  }),
  "208": profile({
    nps: 5,
    laborAnswers: [5, 4, 5, 4, 5, 4, 5],
    rescisaoCorrect: true,
    feelings: [1, 2, 4, 5, 6],
    realocated: "NOT_REALOCATED",
  }),
  "209": {
    NPSSurvey: 0,
    brandRisk: 0,
    laborRisk: 0,
    surveyAnswered: false,
    laborRiskAlert: "NORMAL",
    realocated: "NOT_REALOCATED",
    feelingsMapJSON: null,
    laborRiskJSON: null,
    brandRiskJSON: null,
  },
  "210": profile({
    nps: 8,
    laborAnswers: [8, 7, 8, 8, 7, 8, 7],
    rescisaoCorrect: true,
    feelings: [1, 7, 8],
    realocated: "NOT_REALOCATED",
  }),
};

module.exports = { profiles, buildFeelings, buildLaborRisk, buildBrandRisk };
