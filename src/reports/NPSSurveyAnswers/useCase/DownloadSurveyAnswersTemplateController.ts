import { Request, Response } from "express";
import { GeradorExcelSurveyAnswersTools } from "@utils/excel/excelSurveyAnswers";
import fs from "fs";

class DownloadSurveyAnswersTemplateController {
    async handle(_req: Request, res: Response): Promise<void> {
        const result = await new GeradorExcelSurveyAnswersTools().geradorExcel();

        if (!result.path) {
            res.status(500).json({ message: "Erro ao gerar template" });
            return;
        }

        res.status(200).download(result.path, "Modelo Respostas Survey.xlsx", () => {
            if (result.path) fs.unlink(result.path, () => {});
        });
    }
}

export { DownloadSurveyAnswersTemplateController };
