import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReplacementsReportUseCase } from "./ReplacementsReportUseCase";
import { AppError } from "@shared/errors/AppError";

class ReplacementsReportController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { start_date, end_date, companyId, userId } = request.query;
        if (!start_date || !end_date) {
            throw new AppError("As datas inicial e final são obrigatórias.");
        }
        const replacementsUseCase = container.resolve(
            ReplacementsReportUseCase
        );

        const results = await replacementsUseCase.execute({
            startDate: String(start_date),
            endDate: String(end_date),
            companyId: companyId ? String(companyId) : undefined,
            userId: request.user.id,
        });

        return response.status(200).send(results);
    }
}

export { ReplacementsReportController };
