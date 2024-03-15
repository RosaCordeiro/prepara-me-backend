import { ICreateSubscriptionPlanProductDTO } from "@modules/products/dtos/ICreateSubscriptionPlanProductDTO";
import { ISubscriptionPlanProductsRepository } from "@modules/products/repositories/ISubscriptionPlanProductsRepository";
import { getRepository, Repository } from "typeorm";
import { SubscriptionPlanProduct } from "../entities/SubscriptionPlanProduct";

class SubscriptionPlanProductsRepository
    implements ISubscriptionPlanProductsRepository
{
    private repository: Repository<SubscriptionPlanProduct>;

    constructor() {
        this.repository = getRepository(SubscriptionPlanProduct);
    }

    async create({
        availableQuantity,
        productId,
        subscriptionPlanId,
        id,
    }: ICreateSubscriptionPlanProductDTO): Promise<SubscriptionPlanProduct> {
        const subscriptionPlanProduct = this.repository.create({
            productId,
            subscriptionPlanId,
            availableQuantity,
            id,
        });

        await this.repository.save(subscriptionPlanProduct);

        return subscriptionPlanProduct;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { SubscriptionPlanProductsRepository };
