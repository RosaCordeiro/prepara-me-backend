import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RemoveProductUserUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute(id: string) {
        if (
            id === null ||
            id === undefined ||
            id === "" ||
            id === "undefined"
        ) {
            throw new AppError("Product id is required");
        }

        await this.productsRepository.removeByProductAvailableId(id);
    }
}

export { RemoveProductUserUseCase };

