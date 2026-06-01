import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { getRepository, Repository } from "typeorm";

import { User } from "../entities/User";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async create({
        name,
        username,
        email,
        password,
        documentId,
        type,
        avatar,
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
        console.log("user object", {
            id,
            name,
            username,
            email,
            password,
            documentId,
            type,
            status,
            avatar,
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
        });
        const user = this.repository.create({
            id,
            name,
            username: username ?? name,
            email,
            password,
            documentId,
            type,
            status,
            avatar,
            NPSSurvey,
            laborRisk,
            surveyAnswered,
            companyId,
            realocated,
            feelingsMapJSON,
            brandRisk,
            laborRiskJSON,
            brandRiskJSON,
            laborRiskAlert,
            surveyQuestion,
            expiresDate,
            periodTest,
            subscribeToken,
            companyNameSignIn: companyNameSignIn ?? "",
        });

        await this.repository.save(user);

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ email });

        console.log("user", user);

        return user;
    }

    async findByDocument(documentId: string): Promise<User> {
        const user = await this.repository.findOne({ documentId });

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne(id);

        return user;
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
        const usersQuery = this.repository
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.company", "c");

        if (id) {
            usersQuery.andWhere("u.id = :id", {
                id: id,
            });
        } else {
            if (name) {
                name = `%${name}%`;

                usersQuery.andWhere("u.name like :name", {
                    name: name,
                });
            }

            if (status) {
                usersQuery.andWhere("u.status = :status", {
                    status: status,
                });
            }

            if (documentId) {
                usersQuery.andWhere("u.documentId = :documentId", {
                    documentId: documentId,
                });
            }

            if (type) {
                usersQuery.andWhere("u.type = :type", {
                    type: type,
                });
            }

            if (email) {
                usersQuery.andWhere("u.email = :email", {
                    email: email,
                });
            }

            if (realocated) {
                usersQuery.andWhere("u.realocated = :realocated", {
                    realocated: realocated,
                });
            }

            if (laborRiskAlert) {
                usersQuery.andWhere("u.laborRiskAlert = :laborRiskAlert", {
                    laborRiskAlert: laborRiskAlert,
                });
            }
        }

        const users = await usersQuery.getMany();

        const usersMapped = users.map((user) => {
            return UserMap.toDTO(user);
        });

        return usersMapped;
    }

    async remove(id: string): Promise<any> {
        return this.repository.delete(id);
    }
}

export { UsersRepository };
