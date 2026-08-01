import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { CompaniesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompaniesRepositoryInMemory";
import { SegmentsRepositoryInMemory } from "@modules/segments/repositories/in-memory/SegmentsRepositoryInMemory";
import { SubsegmentsRepositoryInMemory } from "@modules/subsegments/repositories/in-memory/SubsegmentsRepositoryInMemory";
import { CreateCompanyUseCase } from "../createCompany/CreateCompanyUseCase";
import { ListCompanyUseCase } from "../listCompany/ListCompanyUseCase";
import { RemoveCompanyUseCase } from "./RemoveCompanyUseCase";

let companiesRepositoryInMemory: CompaniesRepositoryInMemory;
let listCompanyUseCase: ListCompanyUseCase;
let createCompanyUseCase: CreateCompanyUseCase;
let removeCompanyUseCase: RemoveCompanyUseCase;

describe("Remove Companies", () => {
    beforeEach(() => {
        companiesRepositoryInMemory =
            new CompaniesRepositoryInMemory();
        listCompanyUseCase = new ListCompanyUseCase(
            companiesRepositoryInMemory
        );
        createCompanyUseCase = new CreateCompanyUseCase(
            companiesRepositoryInMemory,
            new SubsegmentsRepositoryInMemory(),
            new SegmentsRepositoryInMemory()
        );
        removeCompanyUseCase = new RemoveCompanyUseCase(
            companiesRepositoryInMemory
        );
    });

    it("should be able to delete a company", async () => {
        const company1: ICreateCompanyDTO = {
            name: "Company One",
        };

        await createCompanyUseCase.execute(company1);

        const company2: ICreateCompanyDTO = {
            name: "Company Two",
        };

        const companyCreated = await createCompanyUseCase.execute(company2);

        await removeCompanyUseCase.execute(companyCreated.id);

        const result = await listCompanyUseCase.execute({
            name: "",
            id: ""
        });

        expect(result).toHaveLength(1);
    });
})