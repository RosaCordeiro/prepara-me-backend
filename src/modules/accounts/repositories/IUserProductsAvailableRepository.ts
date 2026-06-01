import { ICreateUserProductAvailableDTO } from "../dtos/ICreateUserProductAvailableDTO";
import { IUserProductAvailableResponseDTO } from "../dtos/IUserProductAvailableResponseDTO";
import { UserProductAvailable } from "../infra/typeorm/entities/UserProductAvailable";

interface IRequestFind {
    id?: string;
    userId?: string;
    productId?: string;
    onlyAvailables?: boolean;
    onlyAdmin?: boolean;
}

interface IUserProductsAvailableRepository {
    create(data: ICreateUserProductAvailableDTO): Promise<UserProductAvailable>;
    find(data: IRequestFind): Promise<IUserProductAvailableResponseDTO[]>;
    findById(id: string): Promise<UserProductAvailable>;
    findByUser(userId: string): Promise<UserProductAvailable[]>;
    update(id: string, productId: string): Promise<UserProductAvailable>;
}

export { IUserProductsAvailableRepository };
