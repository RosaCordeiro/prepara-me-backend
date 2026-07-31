import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { Between, getRepository, Repository } from "typeorm";
import { Company } from "../entities/Company";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

class CompaniesRepository implements ICompaniesRepository {
    private repository: Repository<Company>;
    private repositoryUsers: Repository<User>;

    constructor() {
        this.repository = getRepository(Company);
        this.repositoryUsers = getRepository(User);
    }

    async listVacancies(companyName: string): Promise<number> {
        console.log(companyName);

        const firstDay = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );
        const lastDay = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
        );

        const response = await this.repositoryUsers.count({
            where: {
                companyNameSignIn: companyName,
                created_at: Between(firstDay, lastDay),
            },
        });

        console.log(response);

        return response;
    }

    async create({
        name,
        id,
        segmentId,
        subsegmentId,
    }: ICreateCompanyDTO): Promise<Company> {
        const company = this.repository.create({
            name,
            id,
            segmentId: segmentId ?? null,
            subsegmentId: subsegmentId ?? null,
        });

        await this.repository.save(company);

        return company;
    }

    async findById(id: string): Promise<Company> {
        const company = await this.repository.findOne(id);

        return company;
    }

    async find({ name, id }): Promise<Company[]> {
        const companiesQuery = this.repository
            .createQueryBuilder("c")
            .leftJoinAndSelect(
                "c.companySubscriptionPlan",
                "companySubscriptionPlans"
            )
            .leftJoinAndSelect(
                "companySubscriptionPlans.subscriptionPlan",
                "subscriptionPlans"
            )
            .leftJoinAndSelect("c.segment", "segment")
            .leftJoinAndSelect("c.subsegment", "subsegment");

        if (id) {
            companiesQuery.andWhere("c.id = :id", {
                id: id,
            });
        } else {
            if (name) {
                name = `%${name}%`;

                companiesQuery.andWhere("c.name like :name", {
                    name: name,
                });
            }
        }

        const companies = await companiesQuery.getMany();

        return companies;
    }

    async findAll() {
        const companies = await this.repository.find();

        return companies;
    }

    async remove(id: string): Promise<void> {
        this.repository.delete(id);
    }
}

export { CompaniesRepository };
