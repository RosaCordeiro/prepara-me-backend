import { ICompanySubscriptionPlansRepository } from "@modules/company/repositories/ICompanySubscriptionPlansRepository";
import { CompanySubscriptionPlansRepository } from "@modules/company/infra/typeorm/repositories/CompanySubscriptionPlansRepository";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { CompaniesRepository } from "@modules/company/infra/typeorm/repositories/CompaniesRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { CompanyEmployeesRepository } from "@modules/company/infra/typeorm/repositories/CompanyEmployeesRepository";
import { container } from "tsyringe";
import { CompanyPageRepository } from "@modules/company/infra/typeorm/repositories/CompanyPageRepository";
import { ICompanyPageRepository } from "@modules/company/repositories/ICompanyPageRepository";

container.registerSingleton<ICompaniesRepository>(
    "CompaniesRepository",
    CompaniesRepository
);

container.registerSingleton<ICompanyEmployeesRepository>(
    "CompanyEmployeesRepository",
    CompanyEmployeesRepository
);

container.registerSingleton<ICompanySubscriptionPlansRepository>(
    "CompanySubscriptionPlansRepository",
    CompanySubscriptionPlansRepository
);

container.registerSingleton<ICompanyPageRepository>(
    "CompanyPageRepository",
    CompanyPageRepository
);
