import { CompaniesRepository } from "@modules/company/infra/typeorm/repositories/CompaniesRepository";
import { SubscriptionPlansRepository } from "@modules/products/infra/typeorm/repositories/SubscriptionPlansRepository";
import { removeDiacritics } from "@utils/removeDiacritcs";
import xl from "excel4node";

import { join } from "path";

export class GeradorExcelEmployeeTools {
    async geradorExcel(): Promise<GenerateExcelToolResponse> {
        return await new Promise(async (resolve, reject) => {
            const companiesRepository = new CompaniesRepository();
            const companies = await companiesRepository.findAll();

            const subscriptionPlans = new SubscriptionPlansRepository();
            const plans = await subscriptionPlans.findAll();

            const header = [
                "Nome",
                "Documento",
                "Telefone",
                "Email",
                "Data de entrada do funcionário",
                "Cargo",
                "Área",
                "Empresa",
                "Plano",
                "Unidade",
                "Pacote Recusado",
                "Gênero",
                "Etnia",
                "PCD",
                "Cidade",
                "Estado",
                "Página do LinkedIn",
            ];

            const wb = new xl.Workbook();

            let indexColumn = 1;
            let indexRow = 1;

            const ws = wb.addWorksheet("Funcionários");

            for (let i = 0; i < header.length; i++) {
                ws.cell(indexRow, indexColumn++)
                    .string(header[i])
                    .style({
                        font: {
                            bold: true,
                        },
                    });
            }

            ws.addDataValidation({
                type: "list",
                allowBlank: true,
                prompt: "Escolha uma empresa",
                errorTitle: "Empresa Inválida",
                error: "Escolha uma empresa válida",
                showDropDown: true,
                sqref: "H2:H10000",
                formulas: [
                    `${companies.map((company) => company.name).sort()}`,
                ],
            });

            ws.addDataValidation({
                type: "list",
                allowBlank: true,
                prompt: "Pacote Recusado",
                errorTitle: "Pacote Recusado Inválido",
                error: "Selecione uma opção válida",
                showDropDown: true,
                sqref: "K2:K10000",
                formulas: ["Sim, Não"],
            });

            ws.addDataValidation({
                type: "list",
                allowBlank: true,
                prompt: "PCD",
                errorTitle: "PCD inválido",
                error: "Selecione uma opção válida",
                showDropDown: true,
                sqref: "N2:N10000",
                formulas: ["Sim, Não"],
            });

            ws.addDataValidation({
                type: "list",
                allowBlank: true,
                prompt: "Gênero",
                errorTitle: "Gênero inválido",
                error: "Selecione uma opção válida",
                showDropDown: true,
                sqref: "L2:L10000",
                formulas: [
                    "Masculino,Feminino,Não Binário,Prefiro não informar",
                ],
            });

            ws.addDataValidation({
                type: "list",
                allowBlank: true,
                prompt: "Etnia",
                errorTitle: "Etnia inválida",
                error: "Selecione uma opção válida",
                showDropDown: true,
                sqref: "M2:M10000",
                formulas: [
                    "Branca,Preta,Parda,Amarela,Indígena,Prefiro não informar",
                ],
            });

            ws.addDataValidation({
                type: "list",
                allowBlank: true,
                prompt: "Escolha um plano",
                errorTitle: "Plano inválido",
                error: "Escolha um plano válido",
                showDropDown: true,
                sqref: "I2:I10000",
                formulas: [`${plans.map((plan) => plan.name).sort()}`],
            });

            const path = join(
                __dirname,
                "../../../tmp",
                `Modelo Funcionários.xlsx`
            );

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
