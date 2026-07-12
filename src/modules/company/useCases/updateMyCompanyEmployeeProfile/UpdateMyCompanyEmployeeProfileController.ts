import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateMyCompanyEmployeeProfileUseCase } from "./UpdateMyCompanyEmployeeProfileUseCase";

class UpdateMyCompanyEmployeeProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { linkedinUrl, showLinkedinInRelocationProgram } = request.body;

        const updateMyCompanyEmployeeProfileUseCase = container.resolve(
            UpdateMyCompanyEmployeeProfileUseCase
        );

        const profile = await updateMyCompanyEmployeeProfileUseCase.execute({
            userId: request.user.id,
            linkedinUrl,
            showLinkedinInRelocationProgram,
        });

        return response.status(200).json(profile);
    }
}

export { UpdateMyCompanyEmployeeProfileController };
