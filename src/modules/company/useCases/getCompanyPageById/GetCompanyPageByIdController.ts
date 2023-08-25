import { container } from "tsyringe";
import { Request, Response } from "express";
import { GetCompanyPageByIdUseCase } from "./GetCompanyPageByIdUseCase";

class GetCompanyPageByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const getCompanyPageByIdUseCase = container.resolve(
            GetCompanyPageByIdUseCase
        );

        const companies = await getCompanyPageByIdUseCase.execute(id);

        return response.status(200).send(companies);
    }
}

export { GetCompanyPageByIdController };
