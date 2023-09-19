import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { getRepository, Repository } from "typeorm";

class ResponsesReport {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async report() {
        const responses = await this.repository.query(`
            select u.id, u."name", u.email, u."feelingsMapJSON", u."laborRiskJSON", u."brandRiskJSON", u."NPSSurvey" from users u where u."surveyAnswered";
        `);

        return responses;
    }
}

export { ResponsesReport };
