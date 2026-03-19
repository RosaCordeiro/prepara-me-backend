import { Request, Response } from "express";
import { ImportSurveyAnswersBatchUseCase } from "./ImportSurveyAnswersBatchUseCase";
import fs from "fs";

class ImportSurveyAnswersBatchController {
    async handle(request: Request, response: Response): Promise<Response> {
        if (!request.files || (request.files as any[]).length === 0) {
            return response.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        const file = (request.files as any[])[0];

        try {
            const useCase = new ImportSurveyAnswersBatchUseCase();
            const result = await useCase.execute(file.filepath);

            return response.status(200).json(result);
        } finally {
            fs.unlink(file.filepath, () => {});
        }
    }
}

export { ImportSurveyAnswersBatchController };
