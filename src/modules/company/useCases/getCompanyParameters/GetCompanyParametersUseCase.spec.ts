import { CompaniesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompaniesRepositoryInMemory";
import { CompanyEmployeesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanyEmployeesRepositoryInMemory";
import { GetCompanyParametersUseCase } from "./GetCompanyParametersUseCase";

let companiesRepositoryInMemory: CompaniesRepositoryInMemory;
let companyEmployeesRepositoryInMemory: CompanyEmployeesRepositoryInMemory;
let getCompanyParametersUseCase: GetCompanyParametersUseCase;
let findByIdSpy: jest.SpyInstance;

describe("GetCompanyParametersUseCase", () => {
    beforeEach(() => {
        companiesRepositoryInMemory = new CompaniesRepositoryInMemory();
        companyEmployeesRepositoryInMemory =
            new CompanyEmployeesRepositoryInMemory();
        companyEmployeesRepositoryInMemory.getParameters = jest
            .fn()
            .mockResolvedValue({ period: [], unity: [], area: [] });
        findByIdSpy = jest.spyOn(companiesRepositoryInMemory, "findById");
        getCompanyParametersUseCase = new GetCompanyParametersUseCase(
            companiesRepositoryInMemory,
            companyEmployeesRepositoryInMemory
        );
    });

    // V-04 — ids que virariam UUID "null"/lixo no Postgres
    it.each(["null", "undefined", "", "  "])(
        "V-04: should reject invalid company id %p with 400 and never call repos",
        async (id) => {
            await expect(
                getCompanyParametersUseCase.execute(id as string)
            ).rejects.toMatchObject({ message: "Invalid id", statusCode: 400 });

            expect(findByIdSpy).not.toHaveBeenCalled();
            expect(
                companyEmployeesRepositoryInMemory.getParameters
            ).not.toHaveBeenCalled();
        }
    );

    it("V-04: should reject nullish id without hitting the repository", async () => {
        await expect(
            getCompanyParametersUseCase.execute(null as unknown as string)
        ).rejects.toMatchObject({ message: "Invalid id", statusCode: 400 });

        expect(findByIdSpy).not.toHaveBeenCalled();
        expect(
            companyEmployeesRepositoryInMemory.getParameters
        ).not.toHaveBeenCalled();
    });

    // V-05 — agregados Admin
    it.each(["TUDO", "B2B", "B2C"])(
        "V-05: should allow aggregate id %p without findById",
        async (id) => {
            const result = await getCompanyParametersUseCase.execute(id);

            expect(result).toEqual({ period: [], unity: [], area: [] });
            expect(findByIdSpy).not.toHaveBeenCalled();
            expect(
                companyEmployeesRepositoryInMemory.getParameters
            ).toHaveBeenCalledWith(
                id,
                undefined,
                undefined,
                undefined,
                undefined
            );
        }
    );

    // V-06 — não confundir not found com Invalid id
    it("V-06: should return Company not found for unknown uuid", async () => {
        const unknownId = "015bcb2e-5ce4-444c-b0c4-96b864aa735f";

        await expect(
            getCompanyParametersUseCase.execute(unknownId)
        ).rejects.toMatchObject({ message: "Company not found" });

        expect(findByIdSpy).toHaveBeenCalledTimes(1);
        expect(findByIdSpy).toHaveBeenCalledWith(unknownId);
        expect(
            companyEmployeesRepositoryInMemory.getParameters
        ).not.toHaveBeenCalled();
    });

    it("V-06: should call getParameters when company exists", async () => {
        const company = await companiesRepositoryInMemory.create({
            name: "Empresa Teste Config",
        });

        const result = await getCompanyParametersUseCase.execute(company.id);

        expect(result).toEqual({ period: [], unity: [], area: [] });
        expect(findByIdSpy).toHaveBeenCalledWith(company.id);
        expect(
            companyEmployeesRepositoryInMemory.getParameters
        ).toHaveBeenCalledWith(
            company.id,
            undefined,
            undefined,
            undefined,
            undefined
        );
    });
});
