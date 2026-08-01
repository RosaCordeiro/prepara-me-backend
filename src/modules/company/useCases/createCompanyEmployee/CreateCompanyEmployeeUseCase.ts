import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { UserStatusEnum } from "@modules/accounts/enums/UserStatusEnum";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCompanyEmployeeUseCase {
    constructor(
        @inject("CompanyEmployeesRepository") private companyEmployeesRepository: ICompanyEmployeesRepository,
        @inject("UsersRepository") private usersRepository: IUsersRepository,
        @inject("UserProductsAvailableRepository") private userProductsAvailableRepository: IUserProductsAvailableRepository,
        @inject("SubscriptionPlansRepository") private subscriptionPlansRepository: ISubscriptionPlansRepository
    ) {}

    async execute({
        companyId,
        documentId,
        name,
        subscribeToken,
        userId,
        phone,
        email,
        id,
        easyRegister,
        entryDate,
        position,
        department,
        plan,
        unity,
        accepted,
        packageDeclined,
        dismissalType,
        gender,
        etnia,
        pcd,
        city,
        state,
        linkedinUrl,
        showLinkedinInRelocationProgram,
    }: ICreateCompanyEmployeeDTO): Promise<CompanyEmployee> {
        console.log({
            companyId,
            documentId,
            name,
            subscribeToken,
            userId,
            phone,
            email,
            id,
            easyRegister,
            entryDate,
            position,
            department,
            plan,
            unity,
            accepted,
            packageDeclined,
            dismissalType,
            gender,
            etnia,
            pcd,
            city,
            state,
            linkedinUrl,
            showLinkedinInRelocationProgram,
        });

        if (!name) {
            throw new AppError("Name can't be null");
        }

        if (!companyId) {
            throw new AppError("Company Id can't be null");
        }

        if (!documentId) {
            throw new AppError("Document Id can't be null");
        }

        if (!easyRegister) {
            throw new AppError("easyRegister can't be null");
        }

        if (packageDeclined === undefined) {
            packageDeclined = false;
        }

        console.log("aqui", plan);

        let planModel = null;

        console.log("planModel", planModel);
        if (!id && plan) {
            planModel = await this.subscriptionPlansRepository.findById(plan);

            if (!planModel) {
                const plansByName = await this.subscriptionPlansRepository.find({ name: plan });
                if (plansByName.length > 0) {
                    planModel = await this.subscriptionPlansRepository.findById(plansByName[0].id);
                }
            }

            if (!planModel) {
                throw new AppError("Plan not found");
            }

            if (!planModel.subscriptionPlanProduct) {
                throw new AppError("Plan Product not found");
            }
        }

        const cEmp: ICreateCompanyEmployeeDTO = {
            companyId,
            documentId,
            name,
            userId,
            subscribeToken,
            phone,
            email,
            id,
            easyRegister,
            entryDate,
            position,
            department,
            plan: undefined,
            unity,
            accepted,
            packageDeclined,
            dismissalType,
            gender,
            etnia,
            pcd,
            city,
            state,
            linkedinUrl,
            showLinkedinInRelocationProgram:
                showLinkedinInRelocationProgram !== undefined
                    ? showLinkedinInRelocationProgram
                    : true,
        };

        if (!id) {
            cEmp.plan = planModel?.name;

            if (email) {
                const companyEmployeeEmailExists =
                    await this.companyEmployeesRepository.find({
                        email,
                    });

                if (companyEmployeeEmailExists.length > 0) {
                    throw new AppError("Company Employee already exists");
                }
            }

            const companyEmployeeDocumentExists =
                await this.companyEmployeesRepository.find({
                    documentId,
                });

            if (companyEmployeeDocumentExists.length > 0) {
                throw new AppError("Company Employee already exists");
            }

            if (email) {
                const userEmailExists = await this.usersRepository.find({
                    email,
                });

                if (userEmailExists.length > 0) {
                    throw new AppError("User already exists");
                }
            }

            const userDocumentExists = await this.usersRepository.find({
                documentId,
            });

            if (userDocumentExists.length > 0) {
                throw new AppError("User already exists");
            }
        } else {
            const existingEmployee = await this.companyEmployeesRepository.findById(id);

            if (!existingEmployee) {
                throw new AppError("Company Employee not found");
            }

            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (documentId !== undefined) updateData.documentId = documentId;
            if (email !== undefined) updateData.email = email;
            if (phone !== undefined) updateData.phone = phone;
            if (entryDate !== undefined) updateData.entryDate = entryDate;
            if (position !== undefined) updateData.position = position;
            if (department !== undefined) updateData.department = department;
            if (plan !== undefined) {
                let resolvedPlan = await this.subscriptionPlansRepository.findById(plan);

                if (!resolvedPlan) {
                    const plansByName = await this.subscriptionPlansRepository.find({ name: plan });
                    if (plansByName.length > 0) {
                        resolvedPlan = await this.subscriptionPlansRepository.findById(plansByName[0].id);
                    }
                }

                if (resolvedPlan) {
                    updateData.plan = resolvedPlan.name;

                    if (existingEmployee.userId && resolvedPlan.subscriptionPlanProduct?.length > 0) {
                        for (const product of resolvedPlan.subscriptionPlanProduct) {
                            await this.userProductsAvailableRepository.create({
                                userId: existingEmployee.userId,
                                productId: product.productId,
                                availableQuantity: product.availableQuantity,
                            });
                        }
                    }
                } else {
                    updateData.plan = plan;
                }
            }
            if (unity !== undefined) updateData.unity = unity;
            if (accepted !== undefined) updateData.accepted = accepted;
            if (packageDeclined !== undefined) updateData.packageDeclined = packageDeclined;
            if (dismissalType !== undefined) updateData.dismissalType = dismissalType;
            if (gender !== undefined) updateData.gender = gender;
            if (etnia !== undefined) updateData.etnia = etnia;
            if (pcd !== undefined) updateData.pcd = pcd;
            if (city !== undefined) updateData.city = city;
            if (state !== undefined) updateData.state = state;
            if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
            if (showLinkedinInRelocationProgram !== undefined) {
                updateData.showLinkedinInRelocationProgram =
                    showLinkedinInRelocationProgram;
            }

            const updatedEmployee = await this.companyEmployeesRepository.update({
                id,
                ...updateData,
            });

            return updatedEmployee;
        }

        let companyEmployeeCreated =
            await this.companyEmployeesRepository.create(cEmp);

        if (!id && !userId && easyRegister) {
            const passwordHash = await hash(
                companyEmployeeCreated.documentId,
                8
            );

            var newEmail = "";

            if (!email) {
                newEmail = `${companyEmployeeCreated.id}@prepara.me`;
            } else {
                newEmail = email;
            }

            console.log("Dados do usuário cadastrado a partir do funcionário", {
                name: companyEmployeeCreated.name,
                username: companyEmployeeCreated.name,
                email: newEmail,
                password: passwordHash,
                documentId: companyEmployeeCreated.documentId,
                type: UserTypeEnum.USER,
                status: UserStatusEnum.ACTIVE,
                NPSSurvey: 0,
                laborRisk: 0,
                surveyAnswered: false,
                companyId,
                realocated: UserRealocatedEnum.NOT_REALOCATED,
                laborRiskAlert: UserLaborRiskAlertEnum.NORMAL,
                expiresDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                ),
                periodTest: new Date(),
                subscribeToken: companyEmployeeCreated.subscribeToken,
                dismissalType: companyEmployeeCreated.dismissalType,
            });

            const userCreated = await this.usersRepository.create({
                name: companyEmployeeCreated.name,
                username: companyEmployeeCreated.name,
                email: newEmail,
                password: passwordHash,
                documentId: companyEmployeeCreated.documentId,
                type: UserTypeEnum.USER,
                status: UserStatusEnum.ACTIVE,
                NPSSurvey: 0,
                laborRisk: 0,
                surveyAnswered: false,
                companyId,
                realocated: UserRealocatedEnum.NOT_REALOCATED,
                laborRiskAlert: UserLaborRiskAlertEnum.NORMAL,
                expiresDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                ),
                periodTest: new Date(),
                subscribeToken: companyEmployeeCreated.subscribeToken,
            });

            companyEmployeeCreated =
                await this.companyEmployeesRepository.create({
                    companyId: companyEmployeeCreated.companyId,
                    documentId: companyEmployeeCreated.documentId,
                    name: companyEmployeeCreated.name,
                    userId: userCreated.id,
                    subscribeToken: companyEmployeeCreated.subscribeToken,
                    phone: companyEmployeeCreated.phone,
                    email: newEmail,
                    id: companyEmployeeCreated.id,
                    easyRegister: companyEmployeeCreated.easyRegister,
                    entryDate: companyEmployeeCreated.entryDate,
                    position: companyEmployeeCreated.position,
                    department: companyEmployeeCreated.department,
                    plan: companyEmployeeCreated.plan,
                    unity: companyEmployeeCreated.unity,
                    packageDeclined: companyEmployeeCreated.packageDeclined,
                    dismissalType: companyEmployeeCreated.dismissalType,
                    gender: companyEmployeeCreated.gender,
                    etnia: companyEmployeeCreated.etnia,
                    pcd: companyEmployeeCreated.pcd,
                    city: companyEmployeeCreated.city,
                    state: companyEmployeeCreated.state,
                    linkedinUrl: companyEmployeeCreated.linkedinUrl,
                    showLinkedinInRelocationProgram:
                        companyEmployeeCreated.showLinkedinInRelocationProgram,
                });

            if (!id && plan && planModel?.subscriptionPlanProduct)
                for (const product of planModel.subscriptionPlanProduct) {
                    console.log("product", product);

                    await this.userProductsAvailableRepository.create({
                        userId: userCreated.id,
                        productId: product.productId,
                        availableQuantity: product.availableQuantity,
                    });
                }
        }

        return companyEmployeeCreated;
    }
}

export { CreateCompanyEmployeeUseCase };
