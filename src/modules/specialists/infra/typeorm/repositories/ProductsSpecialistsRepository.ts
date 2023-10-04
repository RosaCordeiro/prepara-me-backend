import { ICreateProductSpecialistDTO } from "@modules/specialists/dtos/ICreateProductSpecialistDTO";
import { getRepository, Repository } from "typeorm";
import { IProductsSpecialistsRepository } from "../../../repositories/IProductsSpecialistsRepository";
import { ProductSpecialist } from "../entities/ProductSpecialist";
import { isUUID } from "@utils/isUUID";

class ProductsSpecialistsRepository implements IProductsSpecialistsRepository {
    private repository: Repository<ProductSpecialist>;

    constructor() {
        this.repository = getRepository(ProductSpecialist);
    }

    async create({
        productId,
        specialistId,
        id,
    }: ICreateProductSpecialistDTO): Promise<ProductSpecialist> {
        const productSpecialist = this.repository.create({
            productId,
            specialistId,
            id,
        });

        await this.repository.save(productSpecialist);

        return productSpecialist;
    }

    async listSpecialistsByProduct(productId: string): Promise<string[]> {
        const listSpecialistsQuery = this.repository
            .createQueryBuilder("ps")
            .where("product.slug = :productId", { productId });

        const specialists = await listSpecialistsQuery
            .getMany()
            .then((productSpecialists) => {
                return productSpecialists.map((productSpecialist) => {
                    return productSpecialist.specialistId;
                });
            });

        return specialists;
    }

    async find({ productId, specialistId, id }): Promise<ProductSpecialist[]> {
        const productsSpecialistsQuery =
            this.repository.createQueryBuilder("ps");

        if (id) {
            try {
                productsSpecialistsQuery.andWhere("ps.id = :id", {
                    id: id,
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            if (productId) {
                if (isUUID(productId)) {
                    productsSpecialistsQuery.andWhere(
                        "ps.productId = :productId",
                        {
                            productId: productId,
                        }
                    );
                } else {
                    productsSpecialistsQuery
                        .innerJoinAndSelect("ps.product", "product")
                        .where("product.slug = :productId", { productId });
                }
            }

            if (specialistId) {
                productsSpecialistsQuery.andWhere(
                    "ps.specialistId = :specialistId",
                    {
                        specialistId: specialistId,
                    }
                );
            }
        }

        try {
            const productsSpecialists =
                await productsSpecialistsQuery.getMany();

            return productsSpecialists;
        } catch (error) {
            console.log(error);
            /* .innerJoinAndSelect("ps.product", "product")
.where("ps.productId = :productId", { productId }) */
        }

        return [];
    }

    async remove(id: string): Promise<string> {
        this.repository.delete(id);

        return id;
    }
}

export { ProductsSpecialistsRepository };
