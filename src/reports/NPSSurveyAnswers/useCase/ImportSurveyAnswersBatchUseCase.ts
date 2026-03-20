import readXlsxFile from "read-excel-file/node";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { CompanyEmployeesRepository } from "@modules/company/infra/typeorm/repositories/CompanyEmployeesRepository";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";

interface ImportResult {
    success: number;
    errors: { row: number; reason: string }[];
}


const HEADERS = [
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

const FEELINGS_KEYS = [
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

const LABOR_RISK_QUESTIONS = [
    "O quanto você se sentia respeitado na empresa, de forma geral?",
    "O quanto você se sentia respeitado pelos seus líderes?",
    "O quanto você gostaria de voltar a trabalhar nesta empresa no futuro?",
    "O quanto você achou que seu processo de demissão foi respeitoso?",
    "O quanto você se sentia seguro fisicamente na empresa?",
    "O quanto você se sentia seguro emocionalmente na empresa?",
    "O quanto você gostava do pacote de benefícios e remuneração da empresa?",
    "Os cálculos da rescisão estão corretos?",
];

const BRAND_RISK_QUESTIONS = [
    "O quanto você recomenda a empresa para seus amigos e familiares trabalharem?",
];

class ImportSurveyAnswersBatchUseCase {
    private usersRepository = new UsersRepository();
    private companyEmployeesRepository = new CompanyEmployeesRepository();

    async execute(filePath: string): Promise<ImportResult> {
        const rows: any[][] = await readXlsxFile(filePath);


        if (rows[0].length < HEADERS.length) {
            return { success: 0, errors: [{ row: 0, reason: "Cabeçalho inválido: número de colunas incorreto" }] };
        }

        for (let i = 0; i < HEADERS.length; i++) {
            if (rows[0][i] !== HEADERS[i]) {
                return { success: 0, errors: [{ row: 0, reason: `Cabeçalho inválido na coluna ${i + 1}: esperado "${HEADERS[i]}", recebido "${rows[0][i]}"` }] };
            }
        }

        const result: ImportResult = { success: 0, errors: [] };

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 1;

            try {
                const userId = row[0] ? row[0].toString().trim() : "";
                const email = row[2] ? row[2].toString().trim() : "";

                if (!userId && !email) {
                    result.errors.push({ row: rowNum, reason: "ID e Email ausentes — ao menos um é obrigatório" });
                    continue;
                }

                let user: User | null = null;

                if (userId) {
                    user = await this.usersRepository.findById(userId);
                }

                if (!user && email) {
                    user = await this.usersRepository.findByEmail(email);
                }

                if (!user) {
                    result.errors.push({ row: rowNum, reason: `Usuário não encontrado (ID: ${userId}, Email: ${email})` });
                    continue;
                }


                const feelingsMap = FEELINGS_KEYS.map((feeling, idx) => {
                    const val = row[9 + idx];
                    return {
                        feeling,
                        checked: val ? val.toString().trim().toLowerCase() === "sim" : false,
                    };
                });


                const nps = row[21] !== null && row[21] !== undefined ? Number(row[21]) : undefined;


                const laborRisk = LABOR_RISK_QUESTIONS.map((question, idx) => {
                    const val = row[22 + idx];
                    let answer: any = val !== null && val !== undefined ? val : null;

                    if (question === "Os cálculos da rescisão estão corretos?" && answer !== null) {
                        answer = answer.toString().trim().toLowerCase() === "sim" ? 10 : 0;
                    }
                    return { index: idx, question, answer: answer !== null ? Number(answer) : null };
                });

                const brandRisk = BRAND_RISK_QUESTIONS.map((question, idx) => ({
                    index: idx,
                    question,
                    answer: nps !== undefined ? nps : null,
                }));


                const laborRiskAnswers = laborRisk.filter(q => q.answer !== null && q.answer !== undefined && q.question !== "Os cálculos da rescisão estão corretos?");
                const laborRiskAvg = laborRiskAnswers.length > 0
                    ? laborRiskAnswers.reduce((acc, q) => acc + (q.answer as number), 0) / laborRiskAnswers.length
                    : undefined;

                const brandRiskAvg = nps !== undefined ? nps : undefined;

                // Upsert User
                const userUpdate: Partial<User> = {
                    surveyAnswered: true,
                    feelingsMapJSON: JSON.stringify(feelingsMap),
                    laborRiskJSON: JSON.stringify(laborRisk),
                    brandRiskJSON: JSON.stringify(brandRisk),
                    laborRiskAlert: laborRiskAvg !== undefined && laborRiskAvg <= 5
                        ? UserLaborRiskAlertEnum.ALERT
                        : UserLaborRiskAlertEnum.NORMAL,
                };

                if (nps !== undefined) userUpdate.NPSSurvey = nps;
                if (laborRiskAvg !== undefined) userUpdate.laborRisk = laborRiskAvg;
                if (brandRiskAvg !== undefined) userUpdate.brandRisk = brandRiskAvg;

                await (this.usersRepository as any).repository.update(user.id, userUpdate);

                // Upsert CompanyEmployee 
                const employees = await this.companyEmployeesRepository.find({ userId: user.id });
                if (employees.length > 0) {
                    await this.companyEmployeesRepository.update({
                        id: employees[0].id,
                        unity: row[6] ? row[6].toString() : undefined,
                        department: row[7] ? row[7].toString() : undefined,
                        position: row[8] ? row[8].toString() : undefined,
                    });
                }

                result.success++;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                result.errors.push({ row: rowNum, reason: `Erro inesperado: ${message}` });
            }
        }

        return result;
    }
}

export { ImportSurveyAnswersBatchUseCase };
