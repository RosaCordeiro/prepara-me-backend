import xl from "excel4node";

import { join } from "path";

export class GeradorExcelSurveyAnswersTools {
    async geradorExcel(): Promise<GenerateExcelToolResponse> {
        return await new Promise((resolve) => {
            const wb = new xl.Workbook();

            let indexColumn = 1;
            const indexRow = 1;

            const ws = wb.addWorksheet("Respostas");

            const headers = [
                "CPF",
                "Email",
                "NPS (0-10)",
                "Risco Trabalhista (0-10)",
                "Risco de Marca (0-10)",
                "Survey Respondido (Sim/Não)",
                "Alerta Risco Trabalhista (ALERT/NORMAL)",
                "Realocado (REALOCATED/NOT_REALOCATED)",
                "Labor Risk JSON",
                "Feelings Map JSON",
                "Brand Risk JSON",
                "Survey Question JSON",
                "Departamento",
                "Cargo",
                "Unidade",
                "Tipo de Demissão",
                "Gênero",
                "Etnia",
                "PCD (Sim/Não)",
                "Cidade",
                "Estado",
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
                `Modelo Respostas Survey.xlsx`
            );

            wb.write(path, function (err: any, status: any) {
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
