import { Request, Response } from "express";
import { ResponsesReportUseCase } from "./ResponsesReportUseCase";
import fs from "fs";

class ResponsesReportController {
    async handle(request: Request, response: Response): Promise<Response> {
        let responsesReportUseCase = new ResponsesReportUseCase();

        const results = await responsesReportUseCase.execute();

        if (results.success === false) {
            return response.status(409).send({
                message: "Não foi possível gerar o relatório.",
            });
        }

        try {
            response
                .status(200)
                .download(results.path, "", { dotfiles: "deny" }, () => {
                    fs.unlinkSync(results.path);
                });
        } catch (error) {
            return response.status(409).send({
                message: "Não foi possível gerar o relatório.",
            });
        }
    }
}

export { ResponsesReportController };
