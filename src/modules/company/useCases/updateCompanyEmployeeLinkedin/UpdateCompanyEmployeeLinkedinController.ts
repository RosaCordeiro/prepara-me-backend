import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCompanyEmployeeLinkedinUseCase } from "./UpdateCompanyEmployeeLinkedinUseCase";

class UpdateCompanyEmployeeLinkedinController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { linkedinUrl, showLinkedinInRelocationProgram } = request.body;

        const updateCompanyEmployeeLinkedinUseCase = container.resolve(
            UpdateCompanyEmployeeLinkedinUseCase
        );

        const employee = await updateCompanyEmployeeLinkedinUseCase.execute({
            id,
            linkedinUrl,
            showLinkedinInRelocationProgram,
        });

        return response.status(200).json(employee);
    }
}

export { UpdateCompanyEmployeeLinkedinController };
