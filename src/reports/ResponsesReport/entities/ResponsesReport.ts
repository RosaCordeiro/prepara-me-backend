import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { getRepository, Repository } from "typeorm";

class ResponsesReport {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async report(companyId?: string) {
        let additionalQuery = "";

        if (companyId !== undefined) {
            additionalQuery = `and u."companyId" = '${companyId}'`;
        }

        const responses = await this.repository.query(`
            select 
                u.id, 
                u."name", 
                case
                    when u."companyId" is not null then
                        'B2B'
                    else 
                        'B2C'
                end as origem,
                case
                    when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                        (select c."name" from "companyPage" cp  inner join companies c on c.id = cp."companyId" where cp.name = u."companyNameSignIn" limit 1)
                    else
                        case
                            when u."companyId" is not null then
                                (select c.name from companies c where c.id = u."companyId")
                            else 
                                    '-'
                            end           
                end as empresa,
                u.email, 
                u."feelingsMapJSON", 
                u."laborRiskJSON", 
                u."brandRiskJSON", 
                u."NPSSurvey" 
            from users u 
            where u."surveyAnswered" 
            ${additionalQuery};
        `);

        return responses;
    }
}

export { ResponsesReport };
