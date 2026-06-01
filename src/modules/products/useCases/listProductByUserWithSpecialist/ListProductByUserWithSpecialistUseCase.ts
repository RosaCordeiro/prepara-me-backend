import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ListProductByUserWithSpecialistUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute(userId: string, productId?: string) {
        if (
            userId === null ||
            userId === undefined ||
            userId === "" ||
            userId === "undefined"
        ) {
            throw new AppError("User id is required");
        }

        return await this.productsRepository.findByUserIdWithSpecialist(
            userId,
            productId
        );
    }
}

export { ListProductByUserWithSpecialistUseCase };
