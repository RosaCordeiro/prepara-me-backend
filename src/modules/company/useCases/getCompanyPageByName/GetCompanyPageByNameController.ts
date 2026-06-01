import { container } from "tsyringe";
import { Request, Response } from "express";
import { GetCompanyPageByNameUseCase } from "./GetCompanyPageByNameUseCase";

class GetCompanyPageByNameController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name } = request.params;

        const getCompanyPageByNameUseCase = container.resolve(
            GetCompanyPageByNameUseCase
        );

        const companies = await getCompanyPageByNameUseCase.execute(name);

        return response.status(200).send(companies);
    }
}

export { GetCompanyPageByNameController };
