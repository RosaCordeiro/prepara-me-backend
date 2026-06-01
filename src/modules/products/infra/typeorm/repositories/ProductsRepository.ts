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
        await this.repository.query(`
            delete from "userProductsAvailableLog" where "userProductsAvailableId" = '${id}'
        `);

        this.repository.query(`
            delete from "userProductsAvailable" where id = '${id}'
        `);
    }

    async findByUserId(
        userId: string,
        onlyAvailables: boolean,
        productId?: string,
        onlyAdmin?: boolean
    ): Promise<any> {
        let where = `where upa."userId" = '${userId}' `;

        if (productId !== "undefined" && productId !== undefined) {
            where += ` and upa."productId" = '${productId}' `;
        }

        if (onlyAvailables) {
            where += ` and upa."availableQuantity" > 0`;
        }

        if (onlyAdmin !== undefined && onlyAdmin !== null) {   
            where += ` and p."onlyAdmin" = ${onlyAdmin}`;      
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

    async findByUserIdWithSpecialist(
        userId: string,
        productId?: string
    ): Promise<any> {
        console.log("userId", userId);
        console.log("productId", productId);

        const query = `
        select * from (
            select 
                upa.id, 
                "userId", 
                "productId", 
                "availableQuantity", 
                p."name", 
                null as "specialist", 
                null as "schedule",
                NULL as countFilesUser,
                NULL as countFilesSpecialist,
                null as "reason",
                null as "dateSchedule",
                'PRODUTOS DISPONÍVEIS' as "table"
            from "userProductsAvailable" upa 
            inner join products p on p.id = upa."productId"
            where upa."userId" = '${userId}' 
            and upa."availableQuantity" > 0
            ${
                productId !== "undefined"
                    ? `and upa."productId" = '${productId}'`
                    : ""
            }
            
            union 
           
            select 
                ss.id, 
                ss."userId", 
                "productId", 
                0 as availableQuantity, 
                p."name", to_jsonb((array[s.*])[1]) as "specialist", 
                to_jsonb((array[ss.*])[1]) as "schedule",
                CAST(coalesce((select COUNT(*) from "specialistScheduleFiles" ssf where "fileType" = 'USER' and "specialistScheduleId" = SS.id), '0') AS integer) as countFilesUser,
                CAST(coalesce((select COUNT(*) from "specialistScheduleFiles" ssf where "fileType" = 'SPECIALIST' and "specialistScheduleId" = SS.id), '0') AS integer) as countFilesSpecialist,
                null as "reason",
                null as "dateSchedule",
                'PRODUTOS AGENDADOS' as "table"
            from "specialistSchedule" ss 
            inner join products p on p.id = ss."productId"
            inner join specialists s on s.id = ss."specialistId"  
            where ss."userId" = '${userId}'	
            ${
                productId !== "undefined"
                    ? `and ss."productId" = '${productId}'`
                    : ""
            }

            union
            
            select 
            	ssc.id,
            	ssc."userId",
            	"productId",
            	0 as "availableQuantity",
            	p."name",
            	to_jsonb((array[s.*])[1]) as "specialist",
            	null as "schedule",
            	null as countFilesUser,
            	null as countFilesSpecialist,
            	ssc."reason",
            	TO_CHAR(ssc."dateSchedule", 'YYYY-MM-DD"T"HH24:MI:SS') as dateSchedule,
                'PRODUTOS CANCELADOS' as "table"
            from "specialistScheduleCancel" ssc 
            inner join products p on p.id = ssc."productId"
            inner join specialists s on s.id = ssc."specialistId"
            where ssc."userId" = '${userId}'

            ${
                productId !== "undefined"
                    ? `and ssc."productId" = '${productId}'`
                    : ""
            }
        ) AS "schedule"	ORDER BY "availableQuantity" asc, "schedule"->>'dateSchedule' DESC;
    `;

        console.log(query);

        let rows = await this.repository.query(query);

        rows = rows.map((row) => {
            if (row.specialist?.image) {
                row.specialist.image = `${process.env.AWS_BUCKET_URL}/specialists/${row.specialist.image}`;
            }

            return row;
        });

        return rows;
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
        return this.repository.findOne(id);
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
        onlyAdmin
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
            onlyAdmin
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
        onlyAdmin
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
            
            if (onlyAdmin !== undefined && onlyAdmin !== null) {                
                productsQuery.andWhere("p.onlyAdmin = :onlyAdmin", {
                    onlyAdmin: onlyAdmin
                })
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

    async findProductsAvailableByUserId(userId: string, onlyAvailables: boolean, onlyAdmin: boolean): Promise<any[]> {
        let where = `where upa."userId" = '${userId}' `;
        if (onlyAvailables) {
            where += ` and upa."availableQuantity" > 0`;
        }
        if (onlyAdmin !== undefined && onlyAdmin !== null) {   
            where += ` and p."onlyAdmin" = ${onlyAdmin}`;      
        }
        const productsQuery = `
            select 
            upa.*,
            p."name"
            from "userProductsAvailable" upa 
            inner join products p on p.id = upa."productId"
            ${where}`

        return await this.repository.query(productsQuery)
    }
}

export { ProductsRepository };
