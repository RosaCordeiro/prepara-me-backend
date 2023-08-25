import xl from "excel4node";

import { join } from "path";

export class GeradorExcelTools {
    async geradorExcel(
        header: string[],
        data: any[],
        nomeArquivo: string
    ): Promise<GenerateExcelToolResponse> {
        return await new Promise((resolve, reject) => {
            const wb = new xl.Workbook();

            let indexColumn = 1;
            let indexRow = 1;

            const ws = wb.addWorksheet("Agendamentos");

            ws.row(1).filter();

            for (let i = 0; i < header.length; i++) {
                ws.cell(indexRow, indexColumn++)
                    .string(header[i])
                    .style({
                        font: {
                            bold: true,
                        },
                    });
            }

            for (const v of data) {
                indexColumn = 1;
                indexRow++;

                for (const key in v) {
                    ws.cell(indexRow, indexColumn++).string(
                        v[key]?.toString() ?? ""
                    );
                }
            }

            const path = join(__dirname, "../../../tmp", `${nomeArquivo}.xlsx`);

            wb.write(path, function (err: any, status: any) {
                console.log("err", err);
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
