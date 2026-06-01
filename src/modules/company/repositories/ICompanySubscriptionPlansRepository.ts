import { ICreateCompanySubscriptionPlanDTO } from "../dtos/ICreateCompanySubscriptionPlanDTO";
import { CompanySubscriptionPlan } from "../infra/typeorm/entities/CompanySubscriptionPlan";

interface IRequestFind {
    companyId?: string;
    subscriptionPlanId?: string;
    subscribeToken?: string;
    id?: string;
}

interface ICompanySubscriptionPlansRepository {
    create(
        data: ICreateCompanySubscriptionPlanDTO
    ): Promise<CompanySubscriptionPlan>;
    remove(id: string): Promise<string>;
    find(data: IRequestFind): Promise<CompanySubscriptionPlan[]>;
}

export { ICompanySubscriptionPlansRepository };
