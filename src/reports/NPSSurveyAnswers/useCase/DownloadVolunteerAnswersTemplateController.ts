import { Request, Response } from "express";
import { GeradorExcelVolunteerAnswersTools } from "@utils/excel/excelVolunteerModel";
import fs from "fs";

class DownloadVolunteerAnswersTemplateController {
    async handle(_req: Request, res: Response): Promise<void> {
        const result = await new GeradorExcelVolunteerAnswersTools().geradorExcel();

        if (!result.path) {
            res.status(500).json({ message: "Erro ao gerar template" });
            return;
        }

        res.status(200).download(result.path, "Modelo Voluntária.xlsx", () => {
            if (result.path) fs.unlink(result.path, () => {});
        });
    }
}

export { DownloadVolunteerAnswersTemplateController };
