import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { ResponsesReport } from "../entities/ResponsesReport";
import { GeradorExcelTools } from "@utils/excel/excelConversor";

@injectable()
class ResponsesReportUseCase {
    async execute(companyId?: string) {
        const responsesReport = new ResponsesReport();
        const geradorExcelTools = new GeradorExcelTools();
        const result = await responsesReport.report(companyId);
        let companyQuestionsKeys = []

        const feelingsAnswers = {
            "Alíviado(a). Já queria sair da empresa.": null,
            "Surpreso(a). Não esperava pela demissão.": null,
            "Injustiçado(a). Minha demissão foi injusta.": null,
            "Bravo(a). Não concordo em como a demissão aconteceu.": null,
            "Desesperado(a). Preciso me recolocar urgente.": null,
            "Inseguro(a). Estou com a autoestima abalada com a demissão.": null,
            "Inseguro(a). Não sei quais os passos para me recolocar.": null,
            "Triste. Gostava muito do meu trabalho.": null,
            "Triste. Gostava muito da empresa.": null,
            "Triste. Gostava muito da minha equipe de trabalho.": null,
            "Indiferente. Nem feliz e nem triste.": null,
            "Indiferente. Ainda tentando entender tudo que aconteceu.": null,
        };

        const questions = {
            "O quanto você recomenda a empresa para seus amigos e familiares trabalharem?":
                null,
            "O quanto você se sentia respeitado na empresa, de forma geral?":
                null,
            "O quanto você se sentia respeitado pelos seus líderes?": null,
            "O quanto você gostaria de voltar a trabalhar nesta empresa no futuro?":
                null,
            "O quanto você achou que seu processo de demissão foi respeitoso?":
                null,
            "O quanto você se sentia seguro fisicamente na empresa?": null,
            "O quanto você se sentia seguro emocionalmente na empresa?": null,
            "O quanto você gostava do pacote de benefícios e remuneração da empresa?":
                null,
            "Os cálculos da rescisão estão corretos?": null,
        };

        let responses = result.map((r) => {
            const feelingsMap = JSON.parse(r.feelingsMapJSON);

            const copyFeelingsAnswers = JSON.parse(
                JSON.stringify(feelingsAnswers)
            );
            const feelingsAnswersKeys = Object.keys(feelingsAnswers);

            feelingsAnswersKeys.forEach((key) => {
                copyFeelingsAnswers[key] =
                    feelingsMap.find((f) => f.feeling === key)?.checked ?? null;

                if (copyFeelingsAnswers[key] !== null) {
                    copyFeelingsAnswers[key] =
                        copyFeelingsAnswers[key] === true ? "Sim" : "Não";
                }
            });

            const copyQuestions = JSON.parse(JSON.stringify(questions));

            const laborRisk = JSON.parse(r.laborRiskJSON);
            const brandRisk = JSON.parse(r.brandRiskJSON);

            const listRisk = [...laborRisk, ...brandRisk];

            const questionsKeys = Object.keys(questions);

            questionsKeys.forEach((key) => {
                copyQuestions[key] =
                    listRisk.find((f) => f.question === key)?.answer ?? null;
            });

            copyQuestions[
                "O quanto você recomenda a empresa para seus amigos e familiares trabalharem?"
            ] = r.NPSSurvey;

            const verifyQuestion =
                copyQuestions["Os cálculos da rescisão estão corretos?"];
            if (verifyQuestion !== null) {
                if (verifyQuestion === 10 || verifyQuestion === "10") {
                    copyQuestions["Os cálculos da rescisão estão corretos?"] =
                        "Sim";
                }

                if (verifyQuestion === 0 || verifyQuestion === "0") {
                    copyQuestions["Os cálculos da rescisão estão corretos?"] =
                        "Não";
                }
            }

            console.log(r);
            let companyQuestionsAnswers = {}
            
            if (r.surveyQuestion !== null && r.surveyQuestion !== '') {
                r.surveyQuestion = JSON.parse(r.surveyQuestion)
                for (let question of r.surveyQuestion) {                    
                    companyQuestionsAnswers[`${question.questionText}`] = `${question.questionText}: ${question.answer}`
                }
                while (companyQuestionsKeys.length < Object.keys(companyQuestionsAnswers).length) {
                    companyQuestionsKeys.push(companyQuestionsKeys.length + 1);
                }
            }
    
            return {
                id: r.id,
                name: r.name,
                email: r.email,
                origin: r.origem,
                company: r.empresa,
                period: r.periodo,
                unity: r.unidade,
                area: r.area,
                role: r.cargo,
                ...copyFeelingsAnswers,
                ...copyQuestions,
                ...companyQuestionsAnswers
            };
        });
        
        const headers = [
            "ID",
            "Nome",
            "Email",
            "Origem",
            "Empresa",
            "Período",
            "Unidade",
            "Área",
            "Cargo",
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
            "O quanto você recomenda a empresa para seus amigos e familiares trabalharem?",
            "O quanto você se sentia respeitado na empresa, de forma geral?",
            "O quanto você se sentia respeitado pelos seus líderes?",
            "O quanto você gostaria de voltar a trabalhar nesta empresa no futuro?",
            "O quanto você achou que seu processo de demissão foi respeitoso?",
            "O quanto você se sentia seguro fisicamente na empresa?",
            "O quanto você se sentia seguro emocionalmente na empresa?",
            "O quanto você gostava do pacote de benefícios e remuneração da empresa?",
            "Os cálculos da rescisão estão corretos?",
        ];
        for (let key of companyQuestionsKeys) {
            headers.push(`Pergunta ${key}`);
        }

        const excel = await geradorExcelTools.geradorExcel(
            headers,
            responses,
            "Respostas"
        );

        return excel;
    }
}

export { ResponsesReportUseCase };
