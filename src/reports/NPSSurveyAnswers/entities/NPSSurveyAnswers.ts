import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { formatDate, formatDateTimeToISO } from "@utils/formatDate";
import { getRepository, Repository } from "typeorm";

class NPSSurveyAnswers {
    private repository: Repository<CompanyEmployee>;

    constructor() {
        this.repository = getRepository(CompanyEmployee);
    }

    async report(
        companyId: any,
        area: string[],
        role: string[],
        period: Date[][],
        unity: string[]
    ) {
        const NPSSurveyAnswers = this.repository
            .createQueryBuilder("ce")
            .leftJoinAndSelect("ce.user", "u")
            .where("ce.companyId = :companyId", {
                companyId: companyId,
            });

        NPSSurveyAnswers.andWhere("ce.entryDate IS NOT NULL");

        if (area.length > 0) {
            NPSSurveyAnswers.andWhere(
                `ce.department IN (${area.map((a) => `'${a}'`).join(",")})`
            );
        }

        if (role.length > 0) {
            NPSSurveyAnswers.andWhere(
                `ce.position IN (${role.map((r) => `'${r}'`).join(",")})`
            );
        }

        if (period.length > 0) {
            let dateCondition = `ce.entryDate BETWEEN ${formatDateTimeToISO(period[0][0])} 
                AND ${formatDateTimeToISO(period[0][1])}`;
    
            if (period.length > 1) {
                const additionalConditions = period.slice(1).map((p) => {
                    return `OR ce.entryDate BETWEEN ${formatDateTimeToISO(p[0])} 
                    AND ${formatDateTimeToISO(p[1])}`;
                }).join(" ");
    
                dateCondition += ` ${additionalConditions}`;
            }
    
            NPSSurveyAnswers.andWhere(dateCondition);
        }

        if (unity.length > 0) {
            NPSSurveyAnswers.andWhere(
                `ce.unity IN (${unity.map((u) => `'${u}'`).join(",")})`
            );
        }

        const companyUsers = await NPSSurveyAnswers.getMany();

        return companyUsers;
    }

    async reportAllusers() {
        return await this.repository.query(`
        select * from users where "surveyAnswered" is true 
    `);
    }

    async reportAllUsersB2b() {
        return await this.repository.query(`
            select * from users where "surveyAnswered" is true and "companyId" is not null
        `);
    }

    async reportAllUsersB2c() {
        return await this.repository.query(`
        select *from users where "surveyAnswered" is true and "companyId" is null
        `);
    }
}

export { NPSSurveyAnswers };
