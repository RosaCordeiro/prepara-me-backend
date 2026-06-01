import { ICreateSubscriptionPlanDTO } from "../dtos/ICreateSubscriptionPlanDTO";
import { SubscriptionPlan } from "../infra/typeorm/entities/SubscriptionPlan";

import { SubscriptionPlanStatusEnum } from "@modules/products/enums/SubscriptionPlanStatusEnum";
import { SubscriptionPlanTypeEnum } from "@modules/products/enums/SubscriptionPlanTypeEnum";
import { IResponseSubscriptionPlanDTO } from "../dtos/IResponseSubscriptionPlanDTO";

interface IRequestFind {
    name?: string;
    status?: SubscriptionPlanStatusEnum;
    type?: SubscriptionPlanTypeEnum;
    subscribeToken?: string;
    id?: string;
}

interface ISubscriptionPlansRepository {
    create(data: ICreateSubscriptionPlanDTO): Promise<SubscriptionPlan>;
    find(data: IRequestFind): Promise<IResponseSubscriptionPlanDTO[]>;
    remove(id: string): Promise<void>;
    findAll(): Promise<SubscriptionPlan[]>;
    findById(id: string): Promise<SubscriptionPlan>;
}

export { ISubscriptionPlansRepository };
