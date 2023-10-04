import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { IResponseProductDTO } from "@modules/products/dtos/IResponseProductDTO";
import { ProductBestSellerEnum } from "@modules/products/enums/ProductBestSellerEnum";
import { ProductStatusEnum } from "@modules/products/enums/ProductStatusEnum";
import { ProductMap } from "@modules/products/mapper/ProductMap";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { getRepository, LessThanOrEqual, Not, Repository } from "typeorm";

import { Product } from "../entities/Product";
import { AppError } from "@shared/errors/AppError";
import { isUUID } from "@utils/isUUID";

class ProductsRepository implements IProductsRepository {
    private repository: Repository<Product>;

    constructor() {
        this.repository = getRepository(Product);
    }

    findBySlug(slug: string): Promise<Product> {
        return this.repository.findOne({ slug });
    }

    async removeByProductAvailableId(id: string): Promise<void> {
        this.repository.query(`
            delete from "userProductsAvailable" where id = '${id}'
        `);
    }

    async findByUserId(
        userId: string,
        onlyAvailables: boolean,
        productId?: string
    ): Promise<any> {
        let where = `where upa."userId" = '${userId}' `;

        if (productId !== "undefined" && productId !== undefined) {
            where += ` and upa."productId" = '${productId}' `;
        }

        if (onlyAvailables) {
            where += ` and upa."availableQuantity" > 0`;
        }

        return await this.repository.query(`
            select 
            upa.*,
            p."name",
            case
                when upal.id is null then
                    false
                else
                    true
            end as isChanged
            from "userProductsAvailable" upa 
            inner join products p on p.id = upa."productId"
            left join "userProductsAvailableLog" upal on upal."userProductsAvailableId" = upa.id	
            ${where}
        `);
    }

    async findLassThanPrice(id: string): Promise<Product[]> {
        const product = await this.repository.findOne(id);

        if (!product) {
            throw new AppError("Product not found");
        }

        return await this.repository.find({
            where: {
                price: LessThanOrEqual(product.price),
                status: ProductStatusEnum.ACTIVE,
                id: Not(id),
            },
        });
    }

    findById(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }

    async create({
        name,
        shortName,
        price,
        duration,
        status,
        type,
        bestSeller,
        id,
        slug,
    }: ICreateProductDTO): Promise<Product> {
        const product = this.repository.create({
            name,
            shortName,
            price,
            duration,
            status,
            type,
            bestSeller,
            id,
            slug,
        });

        await this.repository.save(product);

        return product;
    }

    async findAvailable(): Promise<Product[]> {
        const productsQuery = this.repository
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.productContent", "productContent")
            .where("p.status = :status", { status: ProductStatusEnum.ACTIVE });

        const products = await productsQuery.getMany();

        return products;
    }

    async findAvailableBestSellers(): Promise<Product[]> {
        const productsQuery = this.repository
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.productContent", "productContent")
            .where("p.status = :status", { status: ProductStatusEnum.ACTIVE })
            .andWhere("p.bestSeller = :bestSeller", {
                bestSeller: ProductBestSellerEnum.BEST_SELLER,
            });

        const products = await productsQuery.getMany();

        return products;
    }

    async find({
        name,
        status,
        type,
        shortName,
        bestSeller,
        id,
    }): Promise<IResponseProductDTO[]> {
        const productsQuery = this.repository
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.productContent", "productContent");

        if (id) {
            if (isUUID(id)) {
                productsQuery.andWhere("p.id = :id", {
                    id: id,
                });
            } else {
                productsQuery.andWhere("p.slug = :id", {
                    id: id,
                });
            }
        } else {
            if (status) {
                productsQuery.andWhere("p.status = :status", {
                    status: status,
                });
            }

            if (type) {
                productsQuery.andWhere("p.type = :type", {
                    type: type,
                });
            }

            if (bestSeller) {
                productsQuery.andWhere("p.bestSeller = :bestSeller", {
                    bestSeller: bestSeller,
                });
            }

            if (name) {
                name = `%${name}%`;

                productsQuery.andWhere("p.name like :name", {
                    name: name,
                });
            }

            if (shortName) {
                shortName = `%${shortName}%`;

                productsQuery.andWhere("p.shortName like :shortName", {
                    shortName: shortName,
                });
            }
        }

        const products = await productsQuery.getMany();

        const productsMaped = products.map((product) => {
            return ProductMap.toDTO(product);
        });

        return productsMaped;
    }

    async remove(id: string): Promise<void> {
        this.repository.delete(id);
    }
}

export { ProductsRepository };
