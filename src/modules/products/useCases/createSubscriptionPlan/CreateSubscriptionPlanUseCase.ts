import { ICreateSubscriptionPlanDTO } from "@modules/products/dtos/ICreateSubscriptionPlanDTO";
import { SubscriptionPlanStatusEnum } from "@modules/products/enums/SubscriptionPlanStatusEnum";
import { SubscriptionPlanTypeEnum } from "@modules/products/enums/SubscriptionPlanTypeEnum";
import { SubscriptionPlan } from "@modules/products/infra/typeorm/entities/SubscriptionPlan";
import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateSubscriptionPlanUseCase {
    constructor(
        @inject("SubscriptionPlansRepository")
        private subscriptionPlansRepository: ISubscriptionPlansRepository
    ) {}

    async execute({
        name,
        price,
        status,
        type,
        id,
    }: ICreateSubscriptionPlanDTO): Promise<SubscriptionPlan> {
        if (!name) {
            throw new AppError("Name can't be null");
        }

        if (!Object.values(SubscriptionPlanStatusEnum).includes(status)) {
            throw new AppError("Status entered wrong");
        }

        if (!Object.values(SubscriptionPlanTypeEnum).includes(type)) {
            throw new AppError("Type entered wrong");
        }

        console.log("name", name);

        const planAlreadyExists = await this.subscriptionPlansRepository.find({
            name,
        });

        if (!id && planAlreadyExists.length > 0) {
            throw new AppError("Plan already exists");
        }

        const subscriptionPlan = await this.subscriptionPlansRepository.create({
            name,
            price,
            status,
            type,
            id,
        });

        return subscriptionPlan;
    }
}

export { CreateSubscriptionPlanUseCase };
