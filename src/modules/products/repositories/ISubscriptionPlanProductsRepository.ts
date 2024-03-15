import { ICreateSubscriptionPlanProductDTO } from "../dtos/ICreateSubscriptionPlanProductDTO";
import { SubscriptionPlanProduct } from "../infra/typeorm/entities/SubscriptionPlanProduct";

interface ISubscriptionPlanProductsRepository {
    create(
        data: ICreateSubscriptionPlanProductDTO
    ): Promise<SubscriptionPlanProduct>;
    delete(id: string): Promise<void>;
}

export { ISubscriptionPlanProductsRepository };
