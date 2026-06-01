import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserMap } from "@modules/accounts/mapper/UserMap";

import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
    users: User[] = [];

    async create({
        name,
        username,
        email,
        password,
        documentId,
        type,
        id,
        status,
        NPSSurvey,
        laborRisk,
        surveyAnswered,
        companyId,
        realocated,
        feelingsMapJSON,
        brandRisk,
        laborRiskJSON,
        brandRiskJSON,
        surveyQuestion,
        laborRiskAlert,
        expiresDate,
        periodTest,
        subscribeToken,
        companyNameSignIn,
    }: ICreateUserDTO): Promise<User> {
        const user = new User(
            name,
            username,
            email,
            password,
            documentId,
            type,
            status,
            id,
            NPSSurvey,
            laborRisk,
            surveyAnswered,
            companyId,
            realocated,
            feelingsMapJSON,
            brandRisk,
            laborRiskJSON,
            brandRiskJSON,
            surveyQuestion,
            laborRiskAlert,
            expiresDate,
            periodTest,
            subscribeToken,
            companyNameSignIn
        );

        this.users.push(user);

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        return this.users.find((user) => user.email === email);
    }

    async findByDocument(documentId: string): Promise<User> {
        return this.users.find((user) => user.documentId === documentId);
    }

    async findById(id: string): Promise<User> {
        return this.users.find((user) => user.id === id);
    }

    async find({
        name,
        status,
        type,
        email,
        documentId,
        id,
        realocated,
        laborRiskAlert,
    }): Promise<IUserResponseDTO[]> {
        let users = this.users;

        if (id) {
            users = users.filter((user) => {
                return user.id === id;
            });
        } else {
            if (status) {
                users = users.filter((user) => {
                    return user.status === status;
                });
            }

            if (realocated) {
                users = users.filter((user) => {
                    return user.realocated === realocated;
                });
            }

            if (email) {
                users = users.filter((user) => {
                    return user.email === email;
                });
            }

            if (documentId) {
                users = users.filter((user) => {
                    return user.documentId === documentId;
                });
            }

            if (type) {
                users = users.filter((user) => {
                    return user.type === type;
                });
            }

            if (laborRiskAlert) {
                users = users.filter((user) => {
                    return user.laborRiskAlert === laborRiskAlert;
                });
            }

            if (name) {
                users = users.filter((user) => {
                    return user.name.includes(name);
                });
            }
        }

        return users.map((user) => {
            return UserMap.toDTO(user);
        });
    }

    async remove(id: string): Promise<string> {
        this.users = this.users.filter((specialist) => {
            return id !== specialist.id;
        });

        return id;
    }
}

export { UsersRepositoryInMemory };
