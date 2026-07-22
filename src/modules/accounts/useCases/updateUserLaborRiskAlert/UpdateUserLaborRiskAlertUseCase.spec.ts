import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { UserStatusEnum } from "@modules/accounts/enums/UserStatusEnum";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CompanyEmployeesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanyEmployeesRepositoryInMemory";
import { CompanySubscriptionPlansRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanySubscriptionPlansRepositoryInMemory";
import { SubscriptionPlansRepositoryInMemory } from "@modules/products/repositories/in-memory/SubscriptionPlansRepositoryInMemory";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/inMemory/MailProviderInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UpdateUserLaborRiskAlertUseCase } from "./UpdateUserLaborRiskAlertUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let companySubscriptionPlansRepository: CompanySubscriptionPlansRepositoryInMemory;
let companyEmployeesRepository: CompanyEmployeesRepositoryInMemory;
let subscriptionPlansRepository: SubscriptionPlansRepositoryInMemory;
let userProductsAvailableRepository: UserProductsAvailableRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;
let updateUserLaborRiskAlertUseCase: UpdateUserLaborRiskAlertUseCase;

describe("update user labor risk alert", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        companySubscriptionPlansRepository =
            new CompanySubscriptionPlansRepositoryInMemory();
        companyEmployeesRepository = new CompanyEmployeesRepositoryInMemory();
        subscriptionPlansRepository = new SubscriptionPlansRepositoryInMemory();
        userProductsAvailableRepository =
            new UserProductsAvailableRepositoryInMemory();
        mailProviderInMemory = new MailProviderInMemory();
        createUserUseCase = new CreateUserUseCase(
            usersRepositoryInMemory,
            companySubscriptionPlansRepository,
            companyEmployeesRepository,
            subscriptionPlansRepository,
            userProductsAvailableRepository
        );
        updateUserLaborRiskAlertUseCase = new UpdateUserLaborRiskAlertUseCase(
            usersRepositoryInMemory,
            mailProviderInMemory
        );
    });

    it("should be able to update a user", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            username: "User",
            email: "user@test.com",
            password: "1234",
            documentId: "00000000000",
            status: UserStatusEnum.ACTIVE,
            type: UserTypeEnum.USER,
            realocated: UserRealocatedEnum.NOT_REALOCATED,
            expiresDate: new Date(),
            periodTest: new Date(),
        };

        const result = await createUserUseCase.execute(user);

        await updateUserLaborRiskAlertUseCase.execute({
            user_id: result.id,
            laborRiskAlert: UserLaborRiskAlertEnum.ALERT
        });

        expect(result.laborRiskAlert).toBe(UserLaborRiskAlertEnum.ALERT);
    });
});

