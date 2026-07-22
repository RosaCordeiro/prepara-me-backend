import { container } from "tsyringe";
import { Request, Response } from "express";
import { ListCompanyEmployeeUseCase } from "./ListCompanyEmployeeUseCase";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { AppError } from "@shared/errors/AppError";

class ListCompanyEmployeeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        let {
            name,
            documentId,
            userId,
            phone,
            email,
            companyId,
            notUserId,
            department,
            dismissalType,
            companyName,
            openToWork,
            position,
            city,
            state,
        } = request.query;

        if (request.user?.id) {
            const usersRepository = new UsersRepository();
            const user = await usersRepository.findById(request.user.id);

            if (user?.type === UserTypeEnum.COMPANY_ADMIN) {
                if (!user.companyId) {
                    throw new AppError(
                        "Company admin without company linked",
                        400
                    );
                }

                companyId = user.companyId;
            }
        }

        const listCompanyEmployeeUseCase = container.resolve(
            ListCompanyEmployeeUseCase
        );

        const companyEmployees = await listCompanyEmployeeUseCase.execute({
            name,
            documentId,
            userId,
            notUserId,
            phone,
            email,
            companyId,
            id,
            department,
            dismissalType,
            companyName,
            openToWork,
            position,
            city,
            state,
        });

        return response.status(200).send(companyEmployees);
    }

    async handleOpenToWork(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { position, department, city, state } = request.query;

        let excludeCompanyId: string | undefined;

        if (request.user?.id) {
            const usersRepository = new UsersRepository();
            const user = await usersRepository.findById(request.user.id);

            if (user?.type === UserTypeEnum.COMPANY_ADMIN) {
                if (!user.companyId) {
                    throw new AppError(
                        "Company admin without company linked",
                        400
                    );
                }

                excludeCompanyId = user.companyId;
            }
        }

        const listCompanyEmployeeUseCase = container.resolve(
            ListCompanyEmployeeUseCase
        );

        const companyEmployees = await listCompanyEmployeeUseCase.execute({
            position,
            department,
            city,
            state,
            excludeCompanyId,
            openToWork: true,
        });

        return response.status(200).send(companyEmployees);
    }
}

export { ListCompanyEmployeeController };
