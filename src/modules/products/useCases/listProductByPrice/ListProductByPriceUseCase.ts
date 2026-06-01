import { IResponseProductDTO } from "@modules/products/dtos/IResponseProductDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ListProductByPriceUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute(id: string): Promise<IResponseProductDTO[]> {
        if (
            id === null ||
            id === undefined ||
            id === "" ||
            id === "undefined"
        ) {
            throw new AppError("Product id is required");
        }
        const products = await this.productsRepository.findLassThanPrice(id);

        return products;
    }
}

export { ListProductByPriceUseCase };
