import { container } from "tsyringe";
import { Request, Response } from "express";
import { ListVacanciesUseCase } from "./listVacanciesUseCase";

class ListVacanciesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyName } = request.params;

        const listVacanciesUseCase = container.resolve(ListVacanciesUseCase);

        const vacancies = await listVacanciesUseCase.execute(companyName);

        return response.status(200).json({
            total: 60 - vacancies,
        });
    }
}

export { ListVacanciesController };
