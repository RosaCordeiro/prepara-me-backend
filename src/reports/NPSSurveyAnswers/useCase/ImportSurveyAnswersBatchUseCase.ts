import readXlsxFile from "read-excel-file/node";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { CompanyEmployeesRepository } from "@modules/company/infra/typeorm/repositories/CompanyEmployeesRepository";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";

interface ImportResult {
    success: number;
    errors: { row: number; reason: string }[];
}

interface ParsedRow {
    user: User;
    employeeId: string | null;
    userUpdate: Partial<User>;
    employeeUpdate: {
        unity?: string;
        department?: string;
        position?: string;
    };
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

const VOLUNTARY_HEADERS = [
    "ID",
    "Nome",
    "Email",
    "Origem",
    "Empresa",
    "Período",
    "Unidade",
    "Área",
    "Cargo",
    "Falta de oportunidades de crescimento ou promoção.",
    "Mais benefícios.",
    "Cargo maior(a). Minha demissão foi injusta.",
    "Desconexão com a empresa.",
    "Desconexão com o time.",
    "Desconexão com a liderança.",
    "Motivos pessoais.",
    "Sobrecarga de trabalho ou estresse.",
    "Modalidade inflexível - Presencial.",
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

export const VOLUNTARY_REASONS_KEYS = [
    "Falta de oportunidades de crescimento ou promoção.",
    "Mais benefícios.",
    "Cargo maior(a). Minha demissão foi injusta.",
    "Desconexão com a empresa.",
    "Desconexão com o time.",
    "Desconexão com a liderança.",
    "Motivos pessoais.",
    "Sobrecarga de trabalho ou estresse.",
    "Modalidade inflexível - Presencial.",
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
    {
        index: 0,
        question:
            "O quanto você se sentia respeitado na empresa, de forma geral?",
    },
    {
        index: 1,
        question: "O quanto você se sentia respeitado pelos seus líderes?",
    },
    {
        index: 2,
        question:
            "O quanto você gostaria de voltar a trabalhar nesta empresa no futuro?",
    },
    {
        index: 3,
        question:
            "O quanto você achou que seu processo de demissão foi respeitoso?",
    },
    {
        index: 4,
        question: "O quanto você se sentia seguro fisicamente na empresa?",
    },
    {
        index: 5,
        question: "O quanto você se sentia seguro emocionalmente na empresa?",
    },
    {
        index: 6,
        question:
            "O quanto você gostava do pacote de benefícios e remuneração da empresa?",
    },
    { index: 9, question: "Os cálculos da rescisão estão corretos?" },
];

class ImportSurveyAnswersBatchUseCase {
    private usersRepository = new UsersRepository();
    private companyEmployeesRepository = new CompanyEmployeesRepository();

    async execute(filePath: string): Promise<ImportResult> {
        const rows: any[][] = await readXlsxFile(filePath);

        const hasIdColumn = rows[0][0] === "ID";

        // Detecta planilha voluntária pela coluna I (índice 9 com ID, 8 sem ID)
        const checkIdx = hasIdColumn ? 9 : 8;
        const isVoluntary = rows[0][checkIdx] === VOLUNTARY_REASONS_KEYS[0];

        const ACTIVE_HEADERS = isVoluntary ? VOLUNTARY_HEADERS : HEADERS;
        const expectedHeaders = hasIdColumn ? ACTIVE_HEADERS : ACTIVE_HEADERS.slice(1);

        // Offsets de colunas diferem entre os modelos (voluntário tem 9 motivos; padrão tem 12 sentimentos)
        const npsColIndex = isVoluntary ? 18 : 21;
        const laborRiskStartIndex = isVoluntary ? 19 : 22;

        if (rows[0].length < expectedHeaders.length) {
            return {
                success: 0,
                errors: [
                    {
                        row: 0,
                        reason: "Cabeçalho inválido: número de colunas incorreto",
                    },
                ],
            };
        }

        for (let i = 0; i < expectedHeaders.length; i++) {
            if (rows[0][i] !== expectedHeaders[i]) {
                return {
                    success: 0,
                    errors: [
                        {
                            row: 0,
                            reason: `Cabeçalho inválido na coluna ${
                                i + 1
                            }: esperado "${expectedHeaders[i]}", recebido "${
                                rows[0][i]
                            }"`,
                        },
                    ],
                };
            }
        }

        const errors: { row: number; reason: string }[] = [];
        const parsedRows: ParsedRow[] = [];

        const dataRows = rows
            .slice(1)
            .map((row) => (hasIdColumn ? row : ["", ...row]));

        let lastDataRow = dataRows.length - 1;
        while (
            lastDataRow >= 0 &&
            dataRows[lastDataRow].every(
                (cell) => cell === null || cell === undefined || cell === ""
            )
        ) {
            lastDataRow--;
        }

        for (let i = 0; i <= lastDataRow; i++) {
            const row = dataRows[i];
            const rowNum = i + 2;

            const userId = row[0] != null ? row[0].toString().trim() : "";
            const name = row[1] != null ? row[1].toString().trim() : "";
            const email = row[2] != null ? row[2].toString().trim() : "";
            const origin = row[3] != null ? row[3].toString().trim() : "";

            const missingFields: string[] = [];
            if (!name) missingFields.push("Nome");
            if (!email) missingFields.push("Email");
            if (!origin) missingFields.push("Origem");

            if (missingFields.length > 0) {
                errors.push({
                    row: rowNum,
                    reason: `Campos obrigatórios ausentes: ${missingFields.join(
                        ", "
                    )}`,
                });
                continue;
            }

            let user: User | null = null;

            if (userId) user = await this.usersRepository.findById(userId);
            if (!user) user = await this.usersRepository.findByEmail(email);

            if (!user) {
                errors.push({
                    row: rowNum,
                    reason: `Usuário não encontrado (ID: ${userId}, Email: ${email})`,
                });
                continue;
            }

            const nps =
                row[npsColIndex] !== null && row[npsColIndex] !== undefined
                    ? Number(row[npsColIndex])
                    : undefined;

            if (nps !== undefined && (isNaN(nps) || nps < 0 || nps > 10)) {
                errors.push({
                    row: rowNum,
                    reason: `NPS inválido: ${row[npsColIndex]} — deve ser entre 0 e 10`,
                });
                continue;
            }

            let riskError = false;
            for (let q = 0; q < LABOR_RISK_QUESTIONS.length - 1; q++) {
                const val = row[laborRiskStartIndex + q];
                if (val !== null && val !== undefined && val !== "") {
                    const num = Number(val);
                    if (isNaN(num) || num < 0 || num > 10) {
                        errors.push({
                            row: rowNum,
                            reason: `Valor inválido na coluna "${LABOR_RISK_QUESTIONS[q].question}": ${val} — deve ser entre 0 e 10`,
                        });
                        riskError = true;
                        break;
                    }
                }
            }
            if (riskError) continue;

            const feelingsMap = isVoluntary
                ? []
                : FEELINGS_KEYS.map((feeling, idx) => {
                    const val = row[9 + idx];
                    return {
                        feeling,
                        checked: val
                            ? val.toString().trim().toLowerCase() === "sim"
                            : false,
                    };
                });

            const dismissalReasonsMap = isVoluntary
                ? VOLUNTARY_REASONS_KEYS.map((reason, idx) => {
                    const val = row[9 + idx];
                    return {
                        reason,
                        checked: val
                            ? val.toString().trim().toLowerCase() === "sim"
                            : false,
                    };
                })
                : null;

            const laborRisk = LABOR_RISK_QUESTIONS.map((item, idx) => {
                const val = row[laborRiskStartIndex + idx];
                let answer: number | null =
                    val !== null && val !== undefined && val !== ""
                        ? Number(val)
                        : null;
                if (
                    item.question ===
                        "Os cálculos da rescisão estão corretos?" &&
                    answer !== null
                ) {
                    answer =
                        val?.toString().trim().toLowerCase() === "sim" ? 10 : 0;
                }
                return { index: item.index, question: item.question, answer };
            });

            const brandRisk = [
                {
                    index: 0,
                    question:
                        "O quanto você recomenda a empresa para seus amigos e familiares trabalharem?",
                    answer: nps ?? null,
                },
            ];

            const laborRiskAnswers = laborRisk.filter(
                (q) =>
                    q.answer !== null && q.answer !== undefined && q.index !== 9
            );
            const laborRiskAvg =
                laborRiskAnswers.length > 0
                    ? laborRiskAnswers.reduce(
                          (acc, q) => acc + (q.answer as number),
                          0
                      ) / laborRiskAnswers.length
                    : undefined;

            const userUpdate: Partial<User> = {
                surveyAnswered: true,
                feelingsMapJSON: JSON.stringify(feelingsMap),
                laborRiskJSON: JSON.stringify(laborRisk),
                brandRiskJSON: JSON.stringify(brandRisk),
                laborRiskAlert:
                    laborRiskAvg !== undefined && laborRiskAvg <= 5
                        ? UserLaborRiskAlertEnum.ALERT
                        : UserLaborRiskAlertEnum.NORMAL,
            };

            if (dismissalReasonsMap !== null) {
                (userUpdate as any).dismissalReasonsJSON = JSON.stringify(dismissalReasonsMap);
            }

            if (nps !== undefined) userUpdate.NPSSurvey = nps;
            if (laborRiskAvg !== undefined) userUpdate.laborRisk = laborRiskAvg;
            if (nps !== undefined) userUpdate.brandRisk = nps;

            const employees = await this.companyEmployeesRepository.find({
                userId: user.id,
            });

            parsedRows.push({
                user,
                employeeId: employees.length > 0 ? employees[0].id : null,
                userUpdate,
                employeeUpdate: {
                    unity: row[6] ? row[6].toString() : undefined,
                    department: row[7] ? row[7].toString() : undefined,
                    position: row[8] ? row[8].toString() : undefined,
                    ...(isVoluntary ? { dismissalType: "voluntary" as any } : {}),
                },
            });
        }

        // se houver qualquer erro, não salva nada
        if (errors.length > 0) {
            return { success: 0, errors };
        }

        for (const parsed of parsedRows) {
            await (this.usersRepository as any).repository.update(
                parsed.user.id,
                parsed.userUpdate
            );

            if (parsed.employeeId) {
                await this.companyEmployeesRepository.update({
                    id: parsed.employeeId,
                    ...parsed.employeeUpdate,
                });
            }
        }

        return { success: parsedRows.length, errors: [] };
    }
}

export { ImportSurveyAnswersBatchUseCase };
