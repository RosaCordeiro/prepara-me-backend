import { container } from "tsyringe";
import { Request, Response } from "express";
import { GetCompanyParametersUseCase } from "./GetCompanyParametersUseCase";

class GetCompanyParametersController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const { period, unity, area, dismissalType } = request.query;

        const getCompanyParametersUseCase = container.resolve(
            GetCompanyParametersUseCase
        );

        const companies = await getCompanyParametersUseCase.execute(
            id,
            period,
            unity,
            area,
            dismissalType
        );

        return response.status(200).send(companies);
    }
}

export { GetCompanyParametersController };
