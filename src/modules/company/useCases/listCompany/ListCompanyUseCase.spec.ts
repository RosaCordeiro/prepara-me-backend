import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { CompaniesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompaniesRepositoryInMemory";
import { SegmentsRepositoryInMemory } from "@modules/segments/repositories/in-memory/SegmentsRepositoryInMemory";
import { SubsegmentsRepositoryInMemory } from "@modules/subsegments/repositories/in-memory/SubsegmentsRepositoryInMemory";
import { CreateCompanyUseCase } from "../createCompany/CreateCompanyUseCase";
import { ListCompanyUseCase } from "./ListCompanyUseCase";

let companiesRepositoryInMemory: CompaniesRepositoryInMemory;
let listCompanyUseCase: ListCompanyUseCase;
let createCompanyUseCase: CreateCompanyUseCase;

describe("List Companies", () => {
    beforeEach(() => {
        companiesRepositoryInMemory = new CompaniesRepositoryInMemory();
        listCompanyUseCase = new ListCompanyUseCase(
            companiesRepositoryInMemory
        );
        createCompanyUseCase = new CreateCompanyUseCase(
            companiesRepositoryInMemory,
            new SubsegmentsRepositoryInMemory(),
            new SegmentsRepositoryInMemory()
        );
    });

    it("should be able to list companies", async () => {
        const company1: ICreateCompanyDTO = {
            name: "Company One",
        };

        await createCompanyUseCase.execute(company1);

        const company2: ICreateCompanyDTO = {
            name: "Company Two",
        };

        await createCompanyUseCase.execute(company2);

        const result = await listCompanyUseCase.execute({
            name: "",
            id: ""
        });

        expect(result).toHaveLength(2);
    });

    it("should be able to list company filtered by name", async () => {
        const company1: ICreateCompanyDTO = {
            name: "Company One",
        };

        await createCompanyUseCase.execute(company1);

        const company2: ICreateCompanyDTO = {
            name: "Company Two",
        };

        await createCompanyUseCase.execute(company2);

        const result = await listCompanyUseCase.execute({
            id: "",
            name: "Two"
        });

        expect(result).toHaveLength(1);
    });
});

