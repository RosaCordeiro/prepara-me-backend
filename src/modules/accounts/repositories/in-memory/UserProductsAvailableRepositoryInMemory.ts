import { ICreateUserProductAvailableDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableDTO";
import { IUserProductAvailableResponseDTO } from "@modules/accounts/dtos/IUserProductAvailableResponseDTO";
import { UserProductAvailable } from "@modules/accounts/infra/typeorm/entities/UserProductAvailable";
import { UserProductsAvailableMap } from "@modules/accounts/mapper/UserProductsAvailable";
import { IUserProductsAvailableRepository } from "../IUserProductsAvailableRepository";

class UserProductsAvailableRepositoryInMemory
    implements IUserProductsAvailableRepository
{
    userProductsAvailable: UserProductAvailable[] = [];

    async create({
        userId,
        productId,
        availableQuantity,
        id,
    }: ICreateUserProductAvailableDTO): Promise<UserProductAvailable> {
        const userProductAvailable = new UserProductAvailable(
            userId,
            productId,
            availableQuantity,
            id
        );

        this.userProductsAvailable.push(userProductAvailable);

        return userProductAvailable;
    }

    async findById(id: string): Promise<UserProductAvailable> {
        return this.userProductsAvailable.find(
            (userProductAvailable) => userProductAvailable.id === id
        );
    }

    async findByUser(userId: string): Promise<UserProductAvailable[]> {
        return this.userProductsAvailable.filter((userProductAvailable) => {
            return userProductAvailable.userId === userId;
        });
    }

    async update(id: string, productId: string): Promise<UserProductAvailable> {
        const userProductAvailable = this.userProductsAvailable.find(
            (item) => item.id === id
        );

        if (!userProductAvailable) {
            return undefined;
        }

        userProductAvailable.productId = productId;
        return userProductAvailable;
    }

    async find({
        id,
        userId,
        productId,
    }): Promise<IUserProductAvailableResponseDTO[]> {
        let userProductsAvailable = this.userProductsAvailable;

        if (id) {
            userProductsAvailable = userProductsAvailable.filter(
                (userProductsAvailable) => {
                    return userProductsAvailable.id === id;
                }
            );
        } else {
            if (userId) {
                userProductsAvailable = userProductsAvailable.filter(
                    (userProductsAvailable) => {
                        return userProductsAvailable.userId === userId;
                    }
                );
            }

            if (productId) {
                userProductsAvailable = userProductsAvailable.filter(
                    (userProductsAvailable) => {
                        return userProductsAvailable.productId === productId;
                    }
                );
            }
        }

        const userProductsAvailableMapped = userProductsAvailable.map(
            (userProductAvailable) => {
                return UserProductsAvailableMap.toDTO(userProductAvailable);
            }
        );

        return userProductsAvailableMapped;
    }
}

export { UserProductsAvailableRepositoryInMemory };
