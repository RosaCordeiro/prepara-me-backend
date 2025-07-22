import { ICreateProductDTO } from "../dtos/ICreateProductDTO";
import { IResponseProductDTO } from "../dtos/IResponseProductDTO";
import { ProductBestSellerEnum } from "../enums/ProductBestSellerEnum";
import { ProductStatusEnum } from "../enums/ProductStatusEnum";
import { ProductTypeEnum } from "../enums/ProductTypesEnum";
import { Product } from "../infra/typeorm/entities/Product";

interface IRequestFind {
    name?: string;
    shortName?: string;
    status?: ProductStatusEnum;
    type?: ProductTypeEnum;
    bestSeller?: ProductBestSellerEnum;
    id?: string;
    onlyAdmin?: boolean
}

interface IProductsRepository {
    create(data: ICreateProductDTO): Promise<Product>;
    findById(id: string): Promise<Product>;
    findBySlug(slug: string): Promise<Product>;
    findAvailable(): Promise<Product[]>;
    findAvailableBestSellers(): Promise<Product[]>;
    findLassThanPrice(id: string): Promise<Product[]>;
    find(data: IRequestFind): Promise<IResponseProductDTO[]>;
    remove(id: string): Promise<void>;
    findByUserId(
        userId: string,
        onlyAvailables: boolean,
        productId?: string,
        onlyAdmin?: boolean
    ): Promise<any>;
    removeByProductAvailableId(id: string): Promise<void>;
    findByUserIdWithSpecialist(
        userId: string,
        productId?: string
    ): Promise<any>;
    findProductsAvailableByUserId(userId: string, onlyAvailables: boolean, onlyAdmin: boolean): Promise<any[]>;
}

export { IProductsRepository };
