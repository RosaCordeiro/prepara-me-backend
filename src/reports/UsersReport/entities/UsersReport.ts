import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { getRepository, Repository } from "typeorm";

class UsersReports {
    private repository: Repository<User>

    constructor() {
        this.repository = getRepository(User);
    }

    async report () {
        const response = await this.repository.query(
            `
            select 
                u.id ,
                u.name,
                u."companyId",
                c.name as company,
                u.created_at as entry_date,
                u."surveyAnswered",
                url.created_at as realocation_date,
                date_part('month', url.created_at) as realocation_month,
                extract(day from (url.created_at - u.created_at)) as realocation_time,
                count(distinct mu) as collective_mentoring,
                count(distinct ss) as individual_mentoring
            from users u 
                left join companies c 
                    on c.id = u."companyId" 
                left join users_realocated_logs url 
                    on url."userId" = u.id
                left join "mentoringUsers" mu 
                    on mu."userId" = u.id
                left join "specialistSchedule" ss 
                    on ss."userId" = u.id
            group by
                u.id,
                c.name,
                url.created_at
            `
        )

        return response
    }
}

export { UsersReports }