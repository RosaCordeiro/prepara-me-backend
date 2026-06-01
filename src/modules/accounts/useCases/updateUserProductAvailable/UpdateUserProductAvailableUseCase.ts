import { ICreateUserProductAvailableDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableDTO";
import { UserProductAvailable } from "@modules/accounts/infra/typeorm/entities/UserProductAvailable";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateUserProductAvailableUseCase {
    constructor(
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository
    ) {}

    async execute(
        id: string,
        productId: string
    ): Promise<UserProductAvailable> {
        if (!id) {
            throw new AppError("Id can't be null");
        }

        if (!productId) {
            throw new AppError("Product can't be null");
        }

        const userProductAvailable =
            await this.userProductsAvailableRepository.update(id, productId);

        return userProductAvailable;
    }
}

export { UpdateUserProductAvailableUseCase };
