import xl from "excel4node";

import { join } from "path";

export class GeradorExcelVolunteerAnswersTools {
    async geradorExcel(): Promise<GenerateExcelToolResponse> {
        return await new Promise((resolve) => {
            const wb = new xl.Workbook();

            let indexColumn = 1;
            const indexRow = 1;

            const ws = wb.addWorksheet("Respostas");

            const headers = [
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

            for (let i = 0; i < headers.length; i++) {
                ws.cell(indexRow, indexColumn++)
                    .string(headers[i])
                    .style({
                        font: {
                            bold: true,
                        },
                    });
            }

            const path = join(
                __dirname,
                "../../../tmp",
                `Modelo Voluntária.xlsx`
            );

            wb.write(path, function (err: any, _status: any) {
                if (err !== undefined && err !== null) {
                    resolve({
                        success: false,
                    });
                } else {
                    resolve({
                        success: true,
                        path: path,
                    });
                }
            });
        });
    }
}

export interface GenerateExcelToolResponse {
    success: boolean;
    path?: string;
}
