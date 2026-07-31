import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetMyCompanyEmployeeProfileUseCase } from "./GetMyCompanyEmployeeProfileUseCase";

class GetMyCompanyEmployeeProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const getMyCompanyEmployeeProfileUseCase = container.resolve(
            GetMyCompanyEmployeeProfileUseCase
        );

        const profile = await getMyCompanyEmployeeProfileUseCase.execute(
            request.user.id
        );

        return response.status(200).json(profile);
    }
}

export { GetMyCompanyEmployeeProfileController };
