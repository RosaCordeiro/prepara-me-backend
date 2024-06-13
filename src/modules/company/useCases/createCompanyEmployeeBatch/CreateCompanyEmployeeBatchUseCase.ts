import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { inject, injectable } from "tsyringe";
import readXlsxFile from "read-excel-file/node";

import fs from "fs";
import { ICreateCompanyEmployeeBatchResponseDTO } from "@modules/company/dtos/ICreateCompanyEmployeeBatchResponseDTO";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { hash } from "bcryptjs";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { UserStatusEnum } from "@modules/accounts/enums/UserStatusEnum";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";

@injectable()
class CreateCompanyEmployeeBatchUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository,
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository,
        @inject("SubscriptionPlansRepository")
        private subscriptionPlansRepository: ISubscriptionPlansRepository
    ) {}

    async execute(files: any): Promise<ICreateCompanyEmployeeBatchResponseDTO> {
        const headers = [
            "Nome",
            "Documento",
            "Telefone",
            "Email",
            "Data de entrada do funcionário",
            "Cargo",
            "Empresa",
            "Plano",
            "Unidade",
            "Área",
            "Subárea",
            "Nível",
            "Pacote Recusado",
        ];

        const fileRows: any[][] = await readXlsxFile(`${files[0].filepath}`);
        if (fileRows[0].length !== headers.length) {
            return {
                message: "Arquivo inválido",
                success: false,
            };
        }

        for (let i = 0; i < headers.length; i++) {
            if (fileRows[0][i] !== headers[i]) {
                return {
                    message: "Arquivo inválido",
                    success: false,
                };
            }
        }

        const companies = await this.companiesRepository.findAll();
        const plans = await this.subscriptionPlansRepository.findAll();

        for (const row of fileRows.slice(1)) {
            if (row[3] && !row[3].includes("@")) {
                return {
                    message: `Arquivo inválido, email (${row[3]}) inválido`,
                    success: false,
                };
            }

            const userExists = await this.usersRepository.findByEmail(row[3]);

            if (userExists) {
                return {
                    message: `Arquivo inválido, email (${row[3]}) já cadastrado`,
                    success: false,
                };
            }

            /* validação empresa */
            if (!companies.map((c) => c.name.trim()).includes(row[7])) {
                return {
                    message: `Arquivo inválido, empresa (${row[7]}) não encontrada`,
                    success: false,
                };
            }

            /* validação plano */
            if (!plans.map((p) => p.name.trim()).includes(row[8])) {
                return {
                    message: `Arquivo inválido, plano (${row[8]}) não encontrado`,
                    success: false,
                };
            }
        }

        for (const row of fileRows.slice(1)) {
            const companyEmployeeExists =
                await this.companyEmployeesRepository.find({
                    companyId: companies.find((c) => c.name.trim() === row[7])
                        .id,
                    documentId: row[1],
                });

            if (companyEmployeeExists.length > 0) {
                return {
                    message: `Arquivo inválido, funcionário (${row[0]}) já cadastrado`,
                    success: false,
                };
            }

            /*     
            
            0 "Nome",
            1 "Documento",
            2 "Telefone",
            3"Email",
            4"Data de entrada do funcionário",
            5"Cargo",
            6"Empresa",
            7"Plano",
            8"Unidade",
            9"Área",
            10"Subárea",
            11"Nível",
            12"Pacote Recusado", */

            let companyEmployeeCreated =
                await this.companyEmployeesRepository.create({
                    name: row[0],
                    documentId: row[1],
                    phone: row[2],
                    email: row[3],
                    entryDate: row[4],
                    position: row[5],
                    companyId: companies.find((c) => c.name.trim() === row[6])
                        .id,
                    plan: row[7],
                    unity: row[8],
                    department: row[9],
                    subarea: row[10],
                    level: row[11],
                    subscribeToken: row[6],
                    easyRegister: "YES",
                    packageDeclined: row[12] === "Sim" ? true : false,
                });

            console.log("companyEmployeeCreated", companyEmployeeCreated);

            const passwordHash = await hash(
                companyEmployeeCreated.documentId.toString(),
                8
            );

            console.log("passwordHash", passwordHash);

            const userCreated = await this.usersRepository.create({
                name: companyEmployeeCreated.name,
                username: companyEmployeeCreated.name,
                email: companyEmployeeCreated.email,
                password: passwordHash,
                documentId: companyEmployeeCreated.documentId,
                type: UserTypeEnum.USER,
                status: UserStatusEnum.ACTIVE,
                NPSSurvey: 0,
                laborRisk: 0,
                surveyAnswered: false,
                companyId: companyEmployeeCreated.companyId,
                realocated: UserRealocatedEnum.NOT_REALOCATED,
                laborRiskAlert: UserLaborRiskAlertEnum.NORMAL,
                expiresDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                ),
                periodTest: new Date(),
                subscribeToken: companyEmployeeCreated.subscribeToken,
            });

            console.log("userCreated", userCreated);

            companyEmployeeCreated =
                await this.companyEmployeesRepository.create({
                    companyId: companyEmployeeCreated.companyId,
                    documentId: companyEmployeeCreated.documentId,
                    name: companyEmployeeCreated.name,
                    userId: userCreated.id,
                    subscribeToken: companyEmployeeCreated.subscribeToken,
                    phone: companyEmployeeCreated.phone,
                    email: companyEmployeeCreated.email,
                    id: companyEmployeeCreated.id,
                    easyRegister: companyEmployeeCreated.easyRegister,
                    entryDate: companyEmployeeCreated.entryDate,
                    position: companyEmployeeCreated.position,
                    department: companyEmployeeCreated.department,
                    plan: companyEmployeeCreated.plan,
                    unity: companyEmployeeCreated.unity,
                    packageDeclined: companyEmployeeCreated.packageDeclined,
                });

            console.log("companyEmployeeCreated", companyEmployeeCreated);

            const planModel = plans.find(
                (p) => p.name.trim() === row[8].trim()
            );

            console.log("planModel", planModel);

            for (const product of planModel.subscriptionPlanProduct) {
                console.log("product", product);

                await this.userProductsAvailableRepository.create({
                    userId: userCreated.id,
                    productId: product.productId,
                    availableQuantity: product.availableQuantity,
                });
            }
        }

        return {
            message: "Funcionários cadastrados com sucesso",
            success: true,
        };
    }
}

export { CreateCompanyEmployeeBatchUseCase };
