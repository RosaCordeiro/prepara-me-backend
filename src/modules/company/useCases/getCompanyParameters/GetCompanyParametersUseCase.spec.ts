import { CompaniesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompaniesRepositoryInMemory";
import { CompanyEmployeesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanyEmployeesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
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

    it.each(["null", "undefined", "", "  "])(
        "should reject invalid company id %p with 400 and never call findById",
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

    it("should reject nullish id without hitting the repository", async () => {
        await expect(
            getCompanyParametersUseCase.execute(null as unknown as string)
        ).rejects.toBeInstanceOf(AppError);

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should allow aggregate id TUDO without findById", async () => {
        const result = await getCompanyParametersUseCase.execute("TUDO");

        expect(result).toEqual({ period: [], unity: [], area: [] });
        expect(findByIdSpy).not.toHaveBeenCalled();
        expect(
            companyEmployeesRepositoryInMemory.getParameters
        ).toHaveBeenCalledWith("TUDO", undefined, undefined, undefined, undefined);
    });
});
