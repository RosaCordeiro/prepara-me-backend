import { getRepository, Repository } from "typeorm";
import { Company } from "../entities/Company";
import { ICompanyPageRepository } from "@modules/company/repositories/ICompanyPageRepository";
import { CompanyPage } from "../entities/CompanyPage";
import { ICreateCompanyPageDTO } from "@modules/company/dtos/ICreateCompanyPageDTO";

class CompanyPageRepository implements ICompanyPageRepository {
    private repository: Repository<CompanyPage>;

    constructor() {
        this.repository = getRepository(CompanyPage);
    }
    findByCompanyId(id: string): Promise<CompanyPage> {
        const companyPage = this.repository.findOne(
            { company: { id } },
            { relations: ["company"] }
        );

        return companyPage;
    }
    findByName(name: string): Promise<CompanyPage> {
        const companyPage = this.repository.findOne(
            { name },
            { relations: ["company"] }
        );

        return companyPage;
    }
    create(data: ICreateCompanyPageDTO): Promise<CompanyPage> {
        console.log(data);

        const companyPage = this.repository.create(data);

        return this.repository.save(companyPage);
    }
}

export { CompanyPageRepository };
