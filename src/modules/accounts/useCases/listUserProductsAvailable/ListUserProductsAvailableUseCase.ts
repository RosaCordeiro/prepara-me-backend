import { IUserProductAvailableResponseDTO } from "@modules/accounts/dtos/IUserProductAvailableResponseDTO";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListUserProductsAvailableUseCase {
    constructor(
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository
    ) {}

    async execute({
        id,
        userId,
        productId,
        onlyAdmin
    }): Promise<IUserProductAvailableResponseDTO[]> {
        const userProductsAvailable =
            await this.userProductsAvailableRepository.find({
                id,
                userId,
                productId,
                onlyAvailables: true,
                onlyAdmin
            });

        return userProductsAvailable;
    }
}

export { ListUserProductsAvailableUseCase };

