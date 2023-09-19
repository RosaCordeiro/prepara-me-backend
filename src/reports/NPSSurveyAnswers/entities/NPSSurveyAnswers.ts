import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { getRepository, Repository } from "typeorm";

class NPSSurveyAnswers {
    private repository: Repository<CompanyEmployee>;

    constructor() {
        this.repository = getRepository(CompanyEmployee);
    }

    async report(companyId) {
        const NPSSurveyAnswers = this.repository
            .createQueryBuilder("ce")
            .leftJoinAndSelect("ce.user", "u")
            .where("ce.companyId = :companyId", {
                companyId: companyId,
            });

        const companyUsers = await NPSSurveyAnswers.getMany();

        return companyUsers;
    }

    async reportAllusers() {
        return await this.repository.query(`
        select *from users where "surveyAnswered" is true 
    `);
    }
}

export { NPSSurveyAnswers };

