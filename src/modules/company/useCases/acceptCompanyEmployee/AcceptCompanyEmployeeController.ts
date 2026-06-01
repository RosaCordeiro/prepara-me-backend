import { Request, Response } from "express";
import { container } from "tsyringe";
import { AcceptCompanyEmployeeUseCase } from "./AcceptCompanyEmployeeUseCase";

class AcceptCompanyEmployeeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const acceptCompanyEmployeeUseCase = container.resolve(
            AcceptCompanyEmployeeUseCase
        );

        await acceptCompanyEmployeeUseCase.execute(id);

        return response.status(200).send({
            success: true,
        });
    }
}

export { AcceptCompanyEmployeeController };

