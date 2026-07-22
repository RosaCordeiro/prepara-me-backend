import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { CompaniesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompaniesRepositoryInMemory";
import { SegmentsRepositoryInMemory } from "@modules/segments/repositories/in-memory/SegmentsRepositoryInMemory";
import { SubsegmentsRepositoryInMemory } from "@modules/subsegments/repositories/in-memory/SubsegmentsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCompanyUseCase } from "./CreateCompanyUseCase";

let companiesRepositoryInMemory: CompaniesRepositoryInMemory;
let segmentsRepositoryInMemory: SegmentsRepositoryInMemory;
let subsegmentsRepositoryInMemory: SubsegmentsRepositoryInMemory;
let createCompanyUseCase: CreateCompanyUseCase;

describe("Create Company", () => {
    beforeEach(() => {
        companiesRepositoryInMemory = new CompaniesRepositoryInMemory();
        segmentsRepositoryInMemory = new SegmentsRepositoryInMemory();
        subsegmentsRepositoryInMemory = new SubsegmentsRepositoryInMemory();
        createCompanyUseCase = new CreateCompanyUseCase(
            companiesRepositoryInMemory,
            subsegmentsRepositoryInMemory,
            segmentsRepositoryInMemory
        );
    });

    it("should be able to create a new company", async () => {
        const company: ICreateCompanyDTO = {
            name: "Company Test",
        };

        const result = await createCompanyUseCase.execute(company);

        expect(result).toHaveProperty("id");
    });

    it("should not be able to create a company without a name", async () => {
        expect(async () => {
            const company: ICreateCompanyDTO = {
                name: "",
            };

            await createCompanyUseCase.execute(company);
        }).rejects.toBeInstanceOf(AppError);
    });
});
