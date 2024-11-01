import { IResponseProductDTO } from "@modules/products/dtos/IResponseProductDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListProductUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository 
    ) {}

    async execute({
        name,
        shortName,
        status,
        type,
        bestSeller,
        id,
        onlyAdmin
    }): Promise<IResponseProductDTO[]> {        
        const products = await this.productsRepository.find({
            name,
            shortName,
            status,
            type,
            bestSeller,
            id,
            onlyAdmin
        });

        return products;
    }
}

export { ListProductUseCase };

