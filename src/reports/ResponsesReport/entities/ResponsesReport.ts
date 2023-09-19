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
            select u.id, u."name", u.email, u."feelingsMapJSON", u."laborRiskJSON", u."brandRiskJSON", u."NPSSurvey" from users u where u."surveyAnswered" ${additionalQuery};
        `);

        return responses;
    }
}

export { ResponsesReport };
