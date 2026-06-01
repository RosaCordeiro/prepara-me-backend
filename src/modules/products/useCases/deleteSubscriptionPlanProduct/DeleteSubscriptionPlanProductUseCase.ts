import { ICreateSubscriptionPlanProductDTO } from "@modules/products/dtos/ICreateSubscriptionPlanProductDTO";
import { ISubscriptionPlanProductsRepository } from "@modules/products/repositories/ISubscriptionPlanProductsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteSubscriptionPlanProductUseCase {
    constructor(
        @inject("SubscriptionPlanProductsRepository")
        private subscriptionPlanProductsRepository: ISubscriptionPlanProductsRepository
    ) {}

    async execute(id: string) {
        if (!id) {
            throw new AppError("Subscription Plan Product can't be null");
        }

        await this.subscriptionPlanProductsRepository.delete(id);

        return true;
    }
}

export { DeleteSubscriptionPlanProductUseCase };
