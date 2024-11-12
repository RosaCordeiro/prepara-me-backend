import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { ProductBestSellerEnum } from "@modules/products/enums/ProductBestSellerEnum";
import { ProductStatusEnum } from "@modules/products/enums/ProductStatusEnum";
import { ProductTypeEnum } from "@modules/products/enums/ProductTypesEnum";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateProductUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute({
        name,
        shortName,
        price,
        duration,
        status,
        type,
        bestSeller,
        id,
        slug,
        onlyAdmin
    }: ICreateProductDTO): Promise<Product> {
        if (!name) {
            throw new AppError("Name can't be null");
        }

        if (!shortName) {
            throw new AppError("Short Name can't be null");
        }

        if (!price) {
            throw new AppError("Price can't be null");
        }

        if (!Object.values(ProductStatusEnum).includes(status)) {
            throw new AppError("Status entered wrong");
        }

        if (!Object.values(ProductTypeEnum).includes(type)) {
            throw new AppError("Type entered wrong");
        }

        if (!Object.values(ProductBestSellerEnum).includes(bestSeller)) {
            throw new AppError("Best Seller entered wrong");
        }

        const response = await this.productsRepository.findBySlug(slug);

        if (!id && response) {
            throw new AppError("Slug already exists");
        }

        const product = await this.productsRepository.create({
            name,
            shortName,
            price,
            duration,
            status,
            type,
            bestSeller,
            id,
            slug,
            onlyAdmin
        });

        return product;
    }
}

export { CreateProductUseCase };
