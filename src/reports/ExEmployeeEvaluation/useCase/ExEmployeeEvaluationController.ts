import { Request, Response } from "express";
import { ExEmployeeEvaluationUseCase } from "./ExEmployeeEvaluationUseCase";

class ExEmployeeEvaluationController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId } = request.query;
        const useCase = new ExEmployeeEvaluationUseCase();

        const results = await useCase.execute(
            companyId !== undefined ? String(companyId) : undefined
        );

        return response.status(200).send(results);
    }
}

export { ExEmployeeEvaluationController };
