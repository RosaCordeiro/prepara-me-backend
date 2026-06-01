import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ListProductByUserUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute(userId: string, onlyAvailables: boolean, productId?: string, onlyAdmin?: boolean) {
        if (
            userId === null ||
            userId === undefined ||
            userId === "" ||
            userId === "undefined"
        ) {
            throw new AppError("User id is required");
        }

        return await this.productsRepository.findByUserId(
            userId,
            onlyAvailables,
            productId,
            onlyAdmin
        );
    }
}

export { ListProductByUserUseCase };
