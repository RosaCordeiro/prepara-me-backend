import { ICreateUserProductAvailableDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableDTO";
import { UserProductAvailable } from "@modules/accounts/infra/typeorm/entities/UserProductAvailable";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateUserProductAvailableUseCase {
    constructor(
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository
    ) {}

    async execute({
        userId,
        productId,
        availableQuantity,
    }: ICreateUserProductAvailableDTO): Promise<UserProductAvailable> {
        if (!userId) {
            throw new AppError("User can't be null");
        }

        if (!productId) {
            throw new AppError("Product can't be null");
        }

        const userProductAvailable =
            await this.userProductsAvailableRepository.create({
                userId,
                productId,
                availableQuantity,
            });

        return userProductAvailable;
    }
}

export { CreateUserProductAvailableUseCase };
