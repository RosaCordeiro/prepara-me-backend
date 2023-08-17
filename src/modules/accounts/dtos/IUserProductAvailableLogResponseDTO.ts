import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IUserResponseDTO } from "./IUserResponseDTO";

interface IUserProductAvailableResponseDTO {
    id: string;
    userId: string;
    productIdNew: Product;
    productIdOld: Product;
    availableQuantity: number;
    userProductsAvailableId: string;
    created_at: Date;
}

export { IUserProductAvailableResponseDTO };
