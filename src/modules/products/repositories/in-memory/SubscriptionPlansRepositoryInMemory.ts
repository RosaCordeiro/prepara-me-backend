import { ICreateSubscriptionPlanDTO } from "@modules/products/dtos/ICreateSubscriptionPlanDTO";
import { IResponseSubscriptionPlanDTO } from "@modules/products/dtos/IResponseSubscriptionPlanDTO";
import { SubscriptionPlan } from "@modules/products/infra/typeorm/entities/SubscriptionPlan";
import { SubscriptionPlanMap } from "@modules/products/mapper/SubscriptionPlanMap";
import { ISubscriptionPlansRepository } from "../ISubscriptionPlansRepository";

class SubscriptionPlansRepositoryInMemory
    implements ISubscriptionPlansRepository
{
    subscriptionPlans: SubscriptionPlan[] = [];

    async create({
        name,
        price,
        status,
        type,
        id,
    }: ICreateSubscriptionPlanDTO): Promise<SubscriptionPlan> {
        const subscriptionPlan = new SubscriptionPlan(
            name,
            price,
            status,
            type,
            id
        );

        this.subscriptionPlans.push(subscriptionPlan);

        return subscriptionPlan;
    }

    async findById(id: string): Promise<SubscriptionPlan> {
        return this.subscriptionPlans.find(
            (subscriptionPlan) => subscriptionPlan.id === id
        );
    }

    async findAll(): Promise<SubscriptionPlan[]> {
        return this.subscriptionPlans;
    }

    async find({
        name,
        status,
        type,
        id,
    }): Promise<IResponseSubscriptionPlanDTO[]> {
        let subscriptionPlans = this.subscriptionPlans;

        if (id) {
            subscriptionPlans = subscriptionPlans.filter((subscriptionPlan) => {
                return subscriptionPlan.id === id;
            });
        } else {
            if (status) {
                subscriptionPlans = subscriptionPlans.filter(
                    (subscriptionPlan) => {
                        return subscriptionPlan.status === status;
                    }
                );
            }

            if (type) {
                subscriptionPlans = subscriptionPlans.filter(
                    (subscriptionPlan) => {
                        return subscriptionPlan.type === type;
                    }
                );
            }

            if (name) {
                subscriptionPlans = subscriptionPlans.filter(
                    (subscriptionPlan) => {
                        return subscriptionPlan.name.includes(name);
                    }
                );
            }
        }

        const subscriptionPlansMaped = subscriptionPlans.map(
            (subscriptionPlan) => {
                return SubscriptionPlanMap.toDTO(subscriptionPlan);
            }
        );

        return subscriptionPlansMaped;
    }

    async remove(id): Promise<void> {
        this.subscriptionPlans = this.subscriptionPlans.filter(
            (subscriptionPlan) => {
                return id !== subscriptionPlan.id;
            }
        );
    }
}

export { SubscriptionPlansRepositoryInMemory };

