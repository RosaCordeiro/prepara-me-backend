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
        unity: string[],
        dismissalType: string[] = []
    ) {

        console.log("Company ID:", companyId);

        const NPSSurveyAnswers = this.repository
            .createQueryBuilder("ce")
            .leftJoinAndSelect("ce.user", "u")
            .where("ce.companyId = :companyId", {
                companyId: companyId,
            });


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
            NPSSurveyAnswers.andWhere(`(${period
                .map(
                    (p) =>
                        `(ce.entryDate BETWEEN ${formatDateTimeToISO(
                            p[0]
                        )} AND ${formatDateTimeToISO(p[1])})`
                )
                .join(" OR ")}
            )`);
        }

        if (unity.length > 0) {
            NPSSurveyAnswers.andWhere(
                `ce.unity IN (${unity.map((u) => `'${u}'`).join(",")})`
            );
        }

        if (dismissalType.length > 0) {
            NPSSurveyAnswers.andWhere(
                `ce.dismissalType IN (${dismissalType.map((dt) => `'${dt}'`).join(",")})`
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
