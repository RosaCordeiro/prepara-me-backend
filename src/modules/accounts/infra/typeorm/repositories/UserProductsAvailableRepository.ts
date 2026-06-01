import { ICreateUserProductAvailableDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableDTO";
import { IUserProductAvailableResponseDTO } from "@modules/accounts/dtos/IUserProductAvailableResponseDTO";
import { UserProductsAvailableMap } from "@modules/accounts/mapper/UserProductsAvailable";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { getRepository, Repository } from "typeorm";
import { UserProductAvailable } from "../entities/UserProductAvailable";
import { UserProductAvailableLog } from "../entities/UserProductAvailableLog";
import { AppError } from "@shared/errors/AppError";

class UserProductsAvailableRepository
    implements IUserProductsAvailableRepository
{
    private repository: Repository<UserProductAvailable>;
    private repositoryLog: Repository<UserProductAvailableLog>;

    constructor() {
        this.repository = getRepository(UserProductAvailable);
        this.repositoryLog = getRepository(UserProductAvailableLog);
    }

    async create({
        userId,
        productId,
        availableQuantity,
        id,
    }: ICreateUserProductAvailableDTO): Promise<UserProductAvailable> {
        const userProductAvailable = this.repository.create({
            userId,
            productId,
            availableQuantity,
            id,
        });

        await this.repository.save(userProductAvailable);

        return userProductAvailable;
    }

    async findById(id: string): Promise<UserProductAvailable> {
        const userProductAvailable = await this.repository.findOne(id);
        return userProductAvailable;
    }

    async findByUser(userId: string): Promise<UserProductAvailable[]> {
        const userProductAvailableQuery = this.repository
            .createQueryBuilder("u")
            .leftJoinAndSelect("u.product", "product")
            .where("u.userId = :userId", {
                userId: userId,
            })
            .andWhere("u.availableQuantity > 0");

        const userProductAvailable = await userProductAvailableQuery.getMany();

        return userProductAvailable;
    }

    async find({
        id,
        userId,
        productId,
        onlyAvailables,
        onlyAdmin
    }): Promise<IUserProductAvailableResponseDTO[]> {
        let userProductAvailableQuery = this.repository
            .createQueryBuilder("upa")
            .leftJoinAndSelect("upa.product", "product")
            .leftJoinAndSelect("upa.user", "user");

        if (onlyAvailables) {
            userProductAvailableQuery = userProductAvailableQuery.andWhere(
                "upa.availableQuantity > 0"
            );
        }

        if (id) {
            userProductAvailableQuery.andWhere("upa.id = :id", {
                id: id,
            });
        } else {
            if (userId) {
                userProductAvailableQuery.andWhere("upa.userId = :userId", {
                    userId: userId,
                });
            }

            if (productId) {
                userProductAvailableQuery.andWhere(
                    "upa.productId = :productId",
                    {
                        productId: productId,
                    }
                );
            }

            if (onlyAdmin !== undefined && onlyAdmin !== null) {   
                userProductAvailableQuery.andWhere(
                    "product.onlyAdmin = :onlyAdmin",
                    {
                        onlyAdmin: onlyAdmin,
                    }
                );    
            }
        }

        const userProductsAvailables =
            await userProductAvailableQuery.getMany();

        const userProductsAvailablesMapped = userProductsAvailables.map(
            (userProductAvailables) => {
                return UserProductsAvailableMap.toDTO(userProductAvailables);
            }
        );

        return userProductsAvailablesMapped;
    }

    async update(id: string, productId: string): Promise<UserProductAvailable> {

        const userProductAvailable = await this.repository.findOne(id);

        const userProductAvailableLog = this.repositoryLog.create({
            userId: userProductAvailable.userId,
            productIdNew: productId,
            productIdOld: userProductAvailable.productId,
            availableQuantity: userProductAvailable.availableQuantity,
            userProductsAvailableId: userProductAvailable.id,
        });

        await this.repositoryLog.save(userProductAvailableLog);

        userProductAvailable.productId = productId;
        await this.repository.save(userProductAvailable);

        return userProductAvailable;
    }
}

export { UserProductsAvailableRepository };
