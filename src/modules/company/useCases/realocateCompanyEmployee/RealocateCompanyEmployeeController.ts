import { Request, Response } from "express";
import { container } from "tsyringe";
import { RealocateCompanyEmployeeUseCase } from "./RealocateCompanyEmployeeUseCase";

class RealocateCompanyEmployeeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const realocateCompanyEmployeeUseCase = container.resolve(
            RealocateCompanyEmployeeUseCase
        );

        await realocateCompanyEmployeeUseCase.execute(id);

        return response.status(200).send({
            success: true,
        });
    }
}

export { RealocateCompanyEmployeeController };
