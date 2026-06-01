import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { UserStatusEnum } from "../enums/UserStatusEnum";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { User } from "../infra/typeorm/entities/User";

interface IRequestFind {
    name?: string;
    type?: UserTypeEnum;
    status?: UserStatusEnum;
    email?: string;
    documentId?: string;
    id?: string;
    realocated?: string;
    laborRiskAlert?: string;
}

interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByDocument(email: string): Promise<User>;
    findById(id: string): Promise<User>;
    find(data: IRequestFind): Promise<IUserResponseDTO[]>;
    remove(id: string): Promise<any>;
}

export { IUsersRepository };

