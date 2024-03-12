import { Request, Response } from "express";

import fs from "fs";
import { GeradorExcelEmployeeTools } from "@utils/excel/excelEmployees";

class DownloadCompanyExcelModelController {
    async handle(request: Request, response: Response): Promise<Response> {
        const geradorExcelEmployeeTools = new GeradorExcelEmployeeTools();
        const res = await geradorExcelEmployeeTools.geradorExcel();

        if (res.path === undefined || res.path === null) {
            return response.status(409).send({
                message: "Error on create company employee batch",
            });
        }

        try {
            response
                .status(200)
                .download(res.path, "", { dotfiles: "deny" }, () => {
                    fs.unlinkSync(res.path);
                });
        } catch (error) {
            return response.status(409).send({
                message: "Não foi possível gerar o relatório.",
            });
        }
    }
}

export { DownloadCompanyExcelModelController };
