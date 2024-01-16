import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCompanyEmployeeUseCase } from "./CreateCompanyEmployeeUseCase";

class CreateCompanyEmployeeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            name,
            documentId,
            subscribeToken,
            userId,
            phone,
            email,
            id,
            easyRegister,
            entryDate,
            position,
            department,
            planId,
        } = request.body;

        const { id: companyId } = request.params;

        const createCompanyEmployeeUseCase = container.resolve(
            CreateCompanyEmployeeUseCase
        );

        const companyEmployee = await createCompanyEmployeeUseCase.execute({
            companyId,
            documentId,
            name,
            subscribeToken,
            userId,
            phone,
            email,
            id,
            easyRegister,
            entryDate,
            position,
            department,
            plan: planId,
        });

        return response.status(201).send(companyEmployee);
    }
}

export { CreateCompanyEmployeeController };
