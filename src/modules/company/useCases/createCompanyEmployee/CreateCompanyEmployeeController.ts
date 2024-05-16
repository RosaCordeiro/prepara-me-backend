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
            unity,
            accepted,
            packageDeclined,
        } = request.body;

        const { id: companyId } = request.params;

        const createCompanyEmployeeUseCase = container.resolve(
            CreateCompanyEmployeeUseCase
        );

        console.log("planId", planId);

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
            unity,
            accepted,
            packageDeclined,
        });

        return response.status(201).send(companyEmployee);
    }
}

export { CreateCompanyEmployeeController };
