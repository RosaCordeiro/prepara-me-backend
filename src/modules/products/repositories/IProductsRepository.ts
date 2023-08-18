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
}

interface IProductsRepository {
    create(data: ICreateProductDTO): Promise<Product>;
    findById(id: string): Promise<Product>;
    findAvailable(): Promise<Product[]>;
    findAvailableBestSellers(): Promise<Product[]>;
    find(data: IRequestFind): Promise<IResponseProductDTO[]>;
    remove(id: string): Promise<void>;
    findByUserId(
        userId: string,
        onlyAvailables: boolean,
        productId?: string
    ): Promise<any>;
    removeByProductAvailableId(id: string): Promise<void>;
}

export { IProductsRepository };
