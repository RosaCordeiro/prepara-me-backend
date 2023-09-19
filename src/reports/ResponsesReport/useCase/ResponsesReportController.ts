import { Request, Response } from "express";
import { ResponsesReportUseCase } from "./ResponsesReportUseCase";
import fs from "fs";

class ResponsesReportController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId } = request.query;

        let responsesReportUseCase = new ResponsesReportUseCase();

        const results = await responsesReportUseCase.execute(
            companyId !== undefined ? String(companyId) : undefined
        );

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
