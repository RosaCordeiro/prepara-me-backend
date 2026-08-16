import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { CompanyEmployeeEasyRegisterEnum } from "@modules/company/enums/CompanyEmployeeEasyRegisterEnum";
import { CompanyEmployeesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanyEmployeesRepositoryInMemory";
import { SubscriptionPlanStatusEnum } from "@modules/products/enums/SubscriptionPlanStatusEnum";
import { SubscriptionPlanTypeEnum } from "@modules/products/enums/SubscriptionPlanTypeEnum";
import { SubscriptionPlanProduct } from "@modules/products/infra/typeorm/entities/SubscriptionPlanProduct";
import { SubscriptionPlansRepositoryInMemory } from "@modules/products/repositories/in-memory/SubscriptionPlansRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCompanyEmployeeUseCase } from "./CreateCompanyEmployeeUseCase";

let companyEmployeesRepositoryInMemory: CompanyEmployeesRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let userProductsAvailableRepositoryInMemory: UserProductsAvailableRepositoryInMemory;
let subscriptionPlansRepositoryInMemory: SubscriptionPlansRepositoryInMemory;
let createCompanyEmployeeUseCase: CreateCompanyEmployeeUseCase;

async function seedPlan(params: {
    id: string;
    name: string;
    products: Array<{ productId: string; availableQuantity: number }>;
}) {
    const plan = await subscriptionPlansRepositoryInMemory.create({
        id: params.id,
        name: params.name,
        price: 100,
        status: SubscriptionPlanStatusEnum.ACTIVE,
        type: SubscriptionPlanTypeEnum.COMPANY,
    });

    plan.subscriptionPlanProduct = params.products.map(
        (product) =>
            new SubscriptionPlanProduct(
                params.id,
                product.productId,
                product.availableQuantity
            )
    );

    return plan;
}

describe("Create Company Employee", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        companyEmployeesRepositoryInMemory =
            new CompanyEmployeesRepositoryInMemory();
        userProductsAvailableRepositoryInMemory =
            new UserProductsAvailableRepositoryInMemory();
        subscriptionPlansRepositoryInMemory =
            new SubscriptionPlansRepositoryInMemory();
        createCompanyEmployeeUseCase = new CreateCompanyEmployeeUseCase(
            companyEmployeesRepositoryInMemory,
            usersRepositoryInMemory,
            userProductsAvailableRepositoryInMemory,
            subscriptionPlansRepositoryInMemory
        );
    });

    it("shold be able to create a new company employee", async () => {
        const companyEmployee: ICreateCompanyEmployeeDTO = {
            name: "Employee Test",
            companyId: "123",
            documentId: "123",
            subscribeToken: "123",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        };

        const result = await createCompanyEmployeeUseCase.execute(
            companyEmployee
        );

        expect(result).toHaveProperty("id");
    });

    it("should not be able to create a company employee without a name", async () => {
        expect(async () => {
            const companyEmployee: ICreateCompanyEmployeeDTO = {
                name: "",
                companyId: "123",
                documentId: "123",
                subscribeToken: "123",
                easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
            };

            await createCompanyEmployeeUseCase.execute(companyEmployee);
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a company employee without a company Id", async () => {
        expect(async () => {
            const companyEmployee: ICreateCompanyEmployeeDTO = {
                name: "Employee Test",
                companyId: "",
                documentId: "123",
                subscribeToken: "123",
                easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
            };

            await createCompanyEmployeeUseCase.execute(companyEmployee);
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a company employee without a document Id", async () => {
        expect(async () => {
            const companyEmployee: ICreateCompanyEmployeeDTO = {
                name: "Employee Test",
                companyId: "123",
                documentId: "",
                subscribeToken: "123",
                easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
            };

            await createCompanyEmployeeUseCase.execute(companyEmployee);
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not recreate mentoring credits on update when plan is unchanged", async () => {
        await seedPlan({
            id: "plan-a",
            name: "Plano A",
            products: [{ productId: "prod-mentoria", availableQuantity: 3 }],
        });

        const employee = await companyEmployeesRepositoryInMemory.create({
            name: "Funcionario",
            companyId: "company-1",
            documentId: "doc-1",
            subscribeToken: "token-1",
            userId: "user-1",
            plan: "Plano A",
            phone: "11999999999",
            email: "func@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        await userProductsAvailableRepositoryInMemory.create({
            userId: "user-1",
            productId: "prod-mentoria",
            availableQuantity: 3,
        });

        await createCompanyEmployeeUseCase.execute({
            id: employee.id,
            name: "Funcionario Editado",
            companyId: "company-1",
            documentId: "doc-1",
            subscribeToken: "token-1",
            userId: "user-1",
            plan: "plan-a",
            phone: "11888888888",
            email: "func@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        const credits =
            await userProductsAvailableRepositoryInMemory.findByUser("user-1");

        expect(credits).toHaveLength(1);
        expect(credits[0].availableQuantity).toBe(3);
    });

    it("should grant mentoring credits on update when plan changes", async () => {
        await seedPlan({
            id: "plan-a",
            name: "Plano A",
            products: [{ productId: "prod-a", availableQuantity: 2 }],
        });
        await seedPlan({
            id: "plan-b",
            name: "Plano B",
            products: [{ productId: "prod-b", availableQuantity: 5 }],
        });

        const employee = await companyEmployeesRepositoryInMemory.create({
            name: "Funcionario",
            companyId: "company-1",
            documentId: "doc-2",
            subscribeToken: "token-2",
            userId: "user-2",
            plan: "Plano A",
            phone: "11999999999",
            email: "func2@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        await userProductsAvailableRepositoryInMemory.create({
            userId: "user-2",
            productId: "prod-a",
            availableQuantity: 2,
        });

        await createCompanyEmployeeUseCase.execute({
            id: employee.id,
            name: "Funcionario",
            companyId: "company-1",
            documentId: "doc-2",
            subscribeToken: "token-2",
            userId: "user-2",
            plan: "plan-b",
            phone: "11999999999",
            email: "func2@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        const credits =
            await userProductsAvailableRepositoryInMemory.findByUser("user-2");

        expect(credits).toHaveLength(2);
        expect(
            credits.some(
                (item) =>
                    item.productId === "prod-b" && item.availableQuantity === 5
            )
        ).toBe(true);

        const updated = await companyEmployeesRepositoryInMemory.findById(
            employee.id
        );
        expect(updated.plan).toBe("Plano B");
    });

    it("should not grant mentoring credits on update without userId", async () => {
        await seedPlan({
            id: "plan-c",
            name: "Plano C",
            products: [{ productId: "prod-c", availableQuantity: 4 }],
        });

        const employee = await companyEmployeesRepositoryInMemory.create({
            name: "Sem Usuario",
            companyId: "company-1",
            documentId: "doc-3",
            subscribeToken: "token-3",
            userId: "",
            plan: "Plano X",
            phone: "11777777777",
            email: "semuser@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        await createCompanyEmployeeUseCase.execute({
            id: employee.id,
            name: "Sem Usuario",
            companyId: "company-1",
            documentId: "doc-3",
            subscribeToken: "token-3",
            userId: "",
            plan: "plan-c",
            phone: "11777777777",
            email: "semuser@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        expect(
            userProductsAvailableRepositoryInMemory.userProductsAvailable
        ).toHaveLength(0);
    });

    it("should update employee fields without granting credits when plan is omitted", async () => {
        const employee = await companyEmployeesRepositoryInMemory.create({
            name: "Sem Plano No Body",
            companyId: "company-1",
            documentId: "doc-4",
            subscribeToken: "token-4",
            userId: "user-4",
            plan: "Plano A",
            phone: "11666666666",
            email: "doc4@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        await userProductsAvailableRepositoryInMemory.create({
            userId: "user-4",
            productId: "prod-mentoria",
            availableQuantity: 1,
        });

        await createCompanyEmployeeUseCase.execute({
            id: employee.id,
            name: "Nome Novo",
            companyId: "company-1",
            documentId: "doc-4",
            subscribeToken: "token-4",
            userId: "user-4",
            phone: "11555555555",
            email: "doc4@teste.com",
            easyRegister: CompanyEmployeeEasyRegisterEnum.NO,
        });

        const credits =
            await userProductsAvailableRepositoryInMemory.findByUser("user-4");
        const updated = await companyEmployeesRepositoryInMemory.findById(
            employee.id
        );

        expect(credits).toHaveLength(1);
        expect(updated.name).toBe("Nome Novo");
        expect(updated.phone).toBe("11555555555");
        expect(updated.plan).toBe("Plano A");
    });
});
