import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { CompanyEmployeeEasyRegisterEnum } from "@modules/company/enums/CompanyEmployeeEasyRegisterEnum";
import { CompanyEmployeesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanyEmployeesRepositoryInMemory";
import { SubscriptionPlansRepositoryInMemory } from "@modules/products/repositories/in-memory/SubscriptionPlansRepositoryInMemory";
import { CreateCompanyEmployeeUseCase } from "../createCompanyEmployee/CreateCompanyEmployeeUseCase";
import { ListCompanyEmployeeUseCase } from "./ListCompanyEmployeeUseCase";

let companyEmployeesRepositoryInMemory: CompanyEmployeesRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let userProductsAvailableRepositoryInMemory: UserProductsAvailableRepositoryInMemory;
let subscriptionPlansRepositoryInMemory: SubscriptionPlansRepositoryInMemory;
let listCompanyEmployeeUseCase: ListCompanyEmployeeUseCase;
let createCompanyEmployeeUseCase: CreateCompanyEmployeeUseCase;

const emptyListFilters = {
    documentId: "",
    email: "",
    phone: "",
    userId: "",
    notUserId: null,
    name: "",
    id: "",
    companyId: "",
    department: "",
    dismissalType: "",
    companyName: "",
    openToWork: "",
};

describe("List Company Employees", () => {
    beforeEach(() => {
        companyEmployeesRepositoryInMemory =
            new CompanyEmployeesRepositoryInMemory();
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        userProductsAvailableRepositoryInMemory =
            new UserProductsAvailableRepositoryInMemory();
        subscriptionPlansRepositoryInMemory =
            new SubscriptionPlansRepositoryInMemory();
        listCompanyEmployeeUseCase = new ListCompanyEmployeeUseCase(
            companyEmployeesRepositoryInMemory
        );
        createCompanyEmployeeUseCase = new CreateCompanyEmployeeUseCase(
            companyEmployeesRepositoryInMemory,
            usersRepositoryInMemory,
            userProductsAvailableRepositoryInMemory,
            subscriptionPlansRepositoryInMemory
        );
    });

    it("should be able to list company employees", async () => {
        const companyEmployee1: ICreateCompanyEmployeeDTO = {
            companyId: "company first",
            name: "first",
            subscribeToken: "teste",
            documentId: "doc-001",
            email: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee1);

        const companyEmployee2: ICreateCompanyEmployeeDTO = {
            companyId: "company second",
            name: "second",
            subscribeToken: "teste",
            documentId: "doc-002",
            email: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee2);

        const result = await listCompanyEmployeeUseCase.execute({
            ...emptyListFilters,
        });

        expect(result).toHaveLength(2);
    });

    it("should be able to list company filtered by name", async () => {
        const companyEmployee1: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            name: "teste",
            subscribeToken: "teste",
            documentId: "doc-101",
            email: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee1);

        const companyEmployee2: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            name: "teste 2",
            subscribeToken: "teste",
            documentId: "doc-102",
            email: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee2);

        const result = await listCompanyEmployeeUseCase.execute({
            ...emptyListFilters,
            name: "teste 2",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list company filtered by documentId", async () => {
        const companyEmployee1: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            name: "teste",
            subscribeToken: "teste",
            documentId: "123",
            email: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee1);

        const companyEmployee2: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            name: "teste 2",
            subscribeToken: "teste",
            documentId: "321",
            email: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee2);

        const result = await listCompanyEmployeeUseCase.execute({
            ...emptyListFilters,
            documentId: "123",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list company filtered by email", async () => {
        const companyEmployee1: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            documentId: "doc-201",
            name: "teste 1",
            subscribeToken: "teste",
            userId: "",
            phone: "8888888",
            email: "teste1@teste.com",
            id: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee1);

        const companyEmployee2: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            documentId: "doc-202",
            name: "teste 2",
            subscribeToken: "teste",
            userId: "",
            phone: "8888888",
            email: "teste2@teste.com",
            id: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee2);

        const result = await listCompanyEmployeeUseCase.execute({
            ...emptyListFilters,
            email: "teste2@teste.com",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list company filtered by phone", async () => {
        const companyEmployee1: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            documentId: "doc-301",
            name: "teste 1",
            subscribeToken: "teste",
            userId: "",
            phone: "9999999",
            email: "phone1@teste.com",
            id: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee1);

        const companyEmployee2: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            documentId: "doc-302",
            name: "teste 2",
            subscribeToken: "teste",
            userId: "",
            phone: "8888888",
            email: "phone2@teste.com",
            id: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee2);

        const result = await listCompanyEmployeeUseCase.execute({
            ...emptyListFilters,
            phone: "8888888",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list company filtered by company", async () => {
        const companyEmployee1: ICreateCompanyEmployeeDTO = {
            companyId: "123",
            documentId: "doc-401",
            name: "teste 1",
            subscribeToken: "teste",
            userId: "",
            phone: "9999999",
            email: "co1@teste.com",
            id: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee1);

        const companyEmployee2: ICreateCompanyEmployeeDTO = {
            companyId: "321",
            documentId: "doc-402",
            name: "teste 2",
            subscribeToken: "teste",
            userId: "",
            phone: "8888888",
            email: "co2@teste.com",
            id: "",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        await createCompanyEmployeeUseCase.execute(companyEmployee2);

        const result = await listCompanyEmployeeUseCase.execute({
            ...emptyListFilters,
            companyId: "123",
        });

        expect(result).toHaveLength(1);
    });
});
