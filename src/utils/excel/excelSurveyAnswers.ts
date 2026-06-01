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
                `Modelo Respostas.xlsx`
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
