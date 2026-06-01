import { ICreateCompanyPageDTO } from "@modules/company/dtos/ICreateCompanyPageDTO";
import { CompanyPage } from "@modules/company/infra/typeorm/entities/CompanyPage";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ICompanyPageRepository } from "@modules/company/repositories/ICompanyPageRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class CreateCompanyPageUseCase {
    constructor(
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository,
        @inject("CompanyPageRepository")
        private companyPageRepository: ICompanyPageRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute(data: ICreateCompanyPageDTO): Promise<CompanyPage> {
        await this.validateCreate(data);

        if (data.logo !== undefined && data.logo !== null && data.logo !== "") {
            const logo = await this.storageProvider.save(data.logo, "company");

            data.logo = logo;
        } else {
            delete data.logo;
        }

        if (
            data.logoInternal !== undefined &&
            data.logoInternal !== null &&
            data.logoInternal !== ""
        ) {
            const logoInternal = await this.storageProvider.save(
                data.logoInternal,
                "company"
            );

            data.logoInternal = logoInternal;
        } else {
            delete data.logoInternal;
        }

        if (data.id === undefined || data.id === null || data.id === "") {
            delete data.id;
        }

        const companyPage = await this.companyPageRepository.create(data);

        return companyPage;
    }

    async validateCreate(data: ICreateCompanyPageDTO): Promise<void> {
        if (data.name === undefined || data.name === null || data.name === "") {
            throw new AppError("Name is required");
        }

        if (data.text === undefined || data.text === null || data.text === "") {
            throw new AppError("Text is required");
        }

        if (data.expirationDate === undefined || data.expirationDate === null) {
            throw new AppError("Expiration Date is required");
        }

        if (
            data.vacancies === undefined ||
            data.vacancies === null ||
            data.vacancies === 0 ||
            isNaN(data.vacancies)
        ) {
            throw new AppError("Vacancies is required");
        }

        if (
            data.companyId === undefined ||
            data.companyId === null ||
            data.companyId === ""
        ) {
            throw new AppError("Company is required");
        }

        const company = await this.companiesRepository.findById(
            String(data.companyId)
        );

        if (!company) {
            throw new AppError("Company not found");
        }

        if (data.active === undefined || data.active === null) {
            throw new AppError("Active is required");
        }

        const companyPage = await this.companyPageRepository.findByCompanyId(
            data.companyId
        );

        if (companyPage) {
            if (companyPage.name !== data.name) {
                const subscribers =
                    await this.companiesRepository.listVacancies(
                        companyPage.name
                    );

                if (subscribers > 0) {
                    throw new AppError(
                        "Não é possível alterar o nome da página com inscrições já realizadas"
                    );
                }
            }
        }
    }
}

export { CreateCompanyPageUseCase };
