import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { ICompanySubscriptionPlansRepository } from "@modules/company/repositories/ICompanySubscriptionPlansRepository";
import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("CompanySubscriptionPlansRepository")
        private companySubscriptionPlansRepository: ICompanySubscriptionPlansRepository,
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository,
        @inject("SubscriptionPlansRepository")
        private subscriptionPlansRepository: ISubscriptionPlansRepository,
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository
    ) {}

    async execute({
        name,
        username,
        email,
        password,
        documentId,
        type,
        status,
        subscribeToken,
        id,
        NPSSurvey,
        laborRisk,
        surveyAnswered,
        companyId,
        realocated,
        laborRiskAlert,
        expiresDate,
        periodTest,
        companyNameSignIn,
    }: ICreateUserDTO): Promise<User> {
        var userFind;

        const addDays = function (days) {
            var date = new Date();

            date.setDate(date.getDate() + days);

            return date;
        };

        if (id) {
            userFind = await this.usersRepository.findById(id);

            if (userFind && userFind.id !== id) {
                throw new AppError("E-mail used by another user!");
            }
        } else {
            userFind = await this.usersRepository.findByEmail(email);

            if (userFind) {
                throw new AppError("E-mail already exists!");
            }
        }

        console.log("userFind", userFind);

        let passwordHash = "";

        if (!userFind) {
            if (!password) {
                throw new AppError("Password can't be null!");
            }

            passwordHash = await hash(password, 8);

            periodTest = addDays(30);
            expiresDate = null;
        } else {
            passwordHash = userFind.password;
        }

        if (!documentId) {
            throw new AppError("DocumentId can't be null!");
        }

        if (!name) {
            throw new AppError("Name can't be null!");
        }

        if (!email) {
            throw new AppError("E-mail can't be null!");
        }

        const userCreated = await this.usersRepository.create({
            name,
            username,
            email,
            password: passwordHash,
            documentId,
            type,
            status,
            id,
            NPSSurvey,
            laborRisk,
            surveyAnswered,
            companyId,
            realocated,
            laborRiskAlert,
            expiresDate,
            periodTest,
            subscribeToken,
            companyNameSignIn: companyNameSignIn ?? "",
        });

        console.log("userCreated", userCreated);

        if (
            userCreated &&
            userCreated.id &&
            !userFind &&
            process.env.NODE_ENV !== "test"
        ) {
            let companyEmployee = await this.companyEmployeesRepository.find({
                documentId,
                notUserId: "true",
            });

            if (!(companyEmployee.length > 0)) {
                companyEmployee = await this.companyEmployeesRepository.find({
                    email,
                    notUserId: "true",
                });
            }

            if (companyEmployee.length > 0) {
                const employeeToken = companyEmployee[0].subscribeToken;

                if (employeeToken) {
                    const companySubscriptionPlans =
                        await this.companySubscriptionPlansRepository.find({
                            subscribeToken: employeeToken,
                        });

                    if (
                        companySubscriptionPlans &&
                        companySubscriptionPlans.length > 0 &&
                        companySubscriptionPlans[0].id
                    ) {
                        companyEmployee[0].user = userCreated;

                        this.companyEmployeesRepository.create({
                            companyId: companyEmployee[0].company.id,
                            documentId: companyEmployee[0].documentId,
                            name: companyEmployee[0].name,
                            subscribeToken: companyEmployee[0].subscribeToken,
                            userId: companyEmployee[0].user.id,
                            phone: companyEmployee[0].phone,
                            email: companyEmployee[0].email,
                            id: companyEmployee[0].id,
                            easyRegister:
                                companyEmployee[0].easyRegister["value"],
                        });

                        const subscriptionPlan =
                            await this.subscriptionPlansRepository.find({
                                id: companySubscriptionPlans[0]
                                    .subscriptionPlanId,
                            });

                        await this.usersRepository.create({
                            name,
                            username,
                            email,
                            password: passwordHash,
                            documentId,
                            type,
                            status,
                            id: userCreated.id,
                            NPSSurvey,
                            laborRisk,
                            surveyAnswered,
                            companyId: companyEmployee[0].company.id,
                            realocated,
                            laborRiskAlert,
                            expiresDate,
                            periodTest,
                            subscribeToken: employeeToken,
                        });

                        if (subscriptionPlan && subscriptionPlan[0]) {
                            subscriptionPlan[0].subscriptionPlanProduct.forEach(
                                async (subscriptionPlanProduct) => {
                                    if (
                                        subscriptionPlanProduct.product.id ==
                                            "5fca32d9-2abd-42a1-9043-2920ef156530" ||
                                        subscriptionPlanProduct.product.id ==
                                            "b2dda7e3-a6f6-4771-b59a-eeb8b7b5769a"
                                    ) {
                                        expiresDate = addDays(90);

                                        await this.usersRepository.create({
                                            name,
                                            username,
                                            email,
                                            password: passwordHash,
                                            documentId,
                                            type,
                                            status,
                                            id: userCreated.id,
                                            NPSSurvey,
                                            laborRisk,
                                            surveyAnswered,
                                            companyId,
                                            realocated,
                                            laborRiskAlert,
                                            expiresDate,
                                            periodTest,
                                            subscribeToken,
                                        });
                                    } else {
                                        await this.userProductsAvailableRepository.create(
                                            {
                                                availableQuantity:
                                                    subscriptionPlanProduct.availableQuantity,
                                                productId:
                                                    subscriptionPlanProduct
                                                        .product.id,
                                                userId: userCreated.id,
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                }
            }
        }

        return userCreated;
    }
}

export { CreateUserUseCase };
