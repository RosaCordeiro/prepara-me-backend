import { ICreateCompanyPageDTO } from "../dtos/ICreateCompanyPageDTO";
import { CompanyPage } from "../infra/typeorm/entities/CompanyPage";

interface ICompanyPageRepository {
    create(data: ICreateCompanyPageDTO): Promise<CompanyPage>;
    findByName(name: string): Promise<CompanyPage>;
    findByCompanyId(id: string): Promise<CompanyPage>;
}

export { ICompanyPageRepository };
