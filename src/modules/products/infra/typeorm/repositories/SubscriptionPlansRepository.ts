import { ICreateSubscriptionPlanDTO } from "@modules/products/dtos/ICreateSubscriptionPlanDTO";
import { IResponseSubscriptionPlanDTO } from "@modules/products/dtos/IResponseSubscriptionPlanDTO";
import { SubscriptionPlanMap } from "@modules/products/mapper/SubscriptionPlanMap";
import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";
import { getRepository, Repository } from "typeorm";
import { SubscriptionPlan } from "../entities/SubscriptionPlan";

class SubscriptionPlansRepository implements ISubscriptionPlansRepository {
    private repository: Repository<SubscriptionPlan>;

    constructor() {
        this.repository = getRepository(SubscriptionPlan);
    }

    async create({
        name,
        price,
        status,
        type,
        id,
    }: ICreateSubscriptionPlanDTO): Promise<SubscriptionPlan> {
        const subscriptionPlan = this.repository.create({
            name,
            price,
            status,
            type,
            id,
        });

        await this.repository.save(subscriptionPlan);

        return subscriptionPlan;
    }

    async findById(id: string): Promise<SubscriptionPlan> {
        if (id === undefined || id === null || id === "") {
            return null;
        }

        console.log("chegou aqui?");

        const subscriptionPlan = await this.repository.findOne(id, {
            relations: [
                "subscriptionPlanProduct",
                "subscriptionPlanProduct.product",
            ],
        });

        console.log("subscriptionPlan", subscriptionPlan);

        return subscriptionPlan;
    }

    async find({
        name,
        status,
        type,
        id,
    }): Promise<IResponseSubscriptionPlanDTO[]> {
        const subscriptionPlansQuery = this.repository
            .createQueryBuilder("sp")
            .leftJoinAndSelect(
                "sp.subscriptionPlanProduct",
                "subscriptionPlanProducts"
            )
            .leftJoinAndSelect("subscriptionPlanProducts.product", "products");

        if (id) {
            subscriptionPlansQuery.andWhere("sp.id = :id", {
                id: id,
            });
        } else {
            if (status) {
                subscriptionPlansQuery.andWhere("sp.status = :status", {
                    status: status,
                });
            }

            if (type) {
                subscriptionPlansQuery.andWhere("sp.type = :type", {
                    type: type,
                });
            }

            if (name) {
                name = `%${name}%`;

                subscriptionPlansQuery.andWhere("sp.name like :name", {
                    name: name,
                });
            }
        }

        const subscriptionPlans = await subscriptionPlansQuery.getMany();

        const subscriptionPlansMaped = subscriptionPlans.map(
            (subscriptionPlan) => {
                return SubscriptionPlanMap.toDTO(subscriptionPlan);
            }
        );

        return subscriptionPlansMaped;
    }

    async remove(id: string): Promise<void> {
        this.repository.delete(id);
    }

    async findAll(): Promise<SubscriptionPlan[]> {
        const subscriptionPlans = await this.repository.find({
            relations: [
                "subscriptionPlanProduct",
                "subscriptionPlanProduct.product",
            ],
        });

        return subscriptionPlans;
    }

    async findByID(id: string): Promise<SubscriptionPlan> {
        console.log("chegou aqui?");

        const subscriptionPlan = await this.repository.findOne(id, {
            relations: [
                "subscriptionPlanProduct",
                "subscriptionPlanProduct.product",
            ],
        });

        console.log("subscriptionPlan", subscriptionPlan);

        return subscriptionPlan;
    }
}

export { SubscriptionPlansRepository };
