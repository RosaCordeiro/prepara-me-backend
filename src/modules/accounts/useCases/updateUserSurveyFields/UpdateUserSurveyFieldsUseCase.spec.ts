import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { UserStatusEnum } from "@modules/accounts/enums/UserStatusEnum";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CompanyEmployeesRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanyEmployeesRepositoryInMemory";
import { CompanySubscriptionPlansRepositoryInMemory } from "@modules/company/repositories/in-memory/CompanySubscriptionPlansRepositoryInMemory";
import { SubscriptionPlansRepositoryInMemory } from "@modules/products/repositories/in-memory/SubscriptionPlansRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UpdateUserSurveyFieldsUseCase } from "./UpdateUserSurveyFieldsUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let companySubscriptionPlansRepository: CompanySubscriptionPlansRepositoryInMemory;
let companyEmployeesRepository: CompanyEmployeesRepositoryInMemory;
let subscriptionPlansRepository: SubscriptionPlansRepositoryInMemory;
let userProductsAvailableRepository: UserProductsAvailableRepositoryInMemory;
let updateUserSurveyFieldsUseCase: UpdateUserSurveyFieldsUseCase;

describe("update user survey", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        companySubscriptionPlansRepository =
            new CompanySubscriptionPlansRepositoryInMemory();
        companyEmployeesRepository = new CompanyEmployeesRepositoryInMemory();
        subscriptionPlansRepository = new SubscriptionPlansRepositoryInMemory();
        userProductsAvailableRepository =
            new UserProductsAvailableRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(
            usersRepositoryInMemory,
            companySubscriptionPlansRepository,
            companyEmployeesRepository,
            subscriptionPlansRepository,
            userProductsAvailableRepository
        );
        updateUserSurveyFieldsUseCase = new UpdateUserSurveyFieldsUseCase(
            usersRepositoryInMemory
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

        await updateUserSurveyFieldsUseCase.execute({
            user_id: result.id,
            laborRisk: 1.5,
            NPSSurvey: 5,
            surveyAnswered: true,
            feelingsMapJSON: "[{teste: 123}]",
            brandRisk: 1,
            brandRiskJSON: "[{teste: 123}]",
            laborRiskJSON: "[{teste: 123}]",
            surveyQuestion: null,
        });

        expect(result).toHaveProperty("id");
        expect(result.laborRisk).toBe(1.5);
        expect(result.NPSSurvey).toBe(5);
        expect(result.surveyAnswered).toBe(true);
        expect(result.feelingsMapJSON).toBe("[{teste: 123}]");
    });
});

