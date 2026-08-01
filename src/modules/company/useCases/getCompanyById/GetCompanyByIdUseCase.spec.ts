import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { CompaniesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompaniesRepositoryInMemory";
import { SegmentsRepositoryInMemory } from "@modules/segments/repositories/in-memory/SegmentsRepositoryInMemory";
import { SubsegmentsRepositoryInMemory } from "@modules/subsegments/repositories/in-memory/SubsegmentsRepositoryInMemory";
import { CreateCompanyUseCase } from "../createCompany/CreateCompanyUseCase";
import { GetCompanyByIdUseCase } from "./GetCompanyByIdUseCase";

let companiesRepositoryInMemory: CompaniesRepositoryInMemory;
let createCompanyUseCase: CreateCompanyUseCase;
let getCompanyByIdUseCase: GetCompanyByIdUseCase;

describe("get subscription plan by id", () => {
    beforeEach(() => {
        companiesRepositoryInMemory =
            new CompaniesRepositoryInMemory();
            getCompanyByIdUseCase = new GetCompanyByIdUseCase(
                companiesRepositoryInMemory
        );
        createCompanyUseCase = new CreateCompanyUseCase(
            companiesRepositoryInMemory,
            new SubsegmentsRepositoryInMemory(),
            new SegmentsRepositoryInMemory()
        );
    });

    it("should be able to get company by id", async () => {
        const company: ICreateCompanyDTO = {
            name: "Company Test One",
        };

        const companyCreated = await createCompanyUseCase.execute(company);

        const result = await getCompanyByIdUseCase.execute(
            companyCreated.id
        );

        expect(result).toHaveProperty("id")
    });
});
