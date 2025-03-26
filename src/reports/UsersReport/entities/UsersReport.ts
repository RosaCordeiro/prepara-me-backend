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
                u.id,
                u.name,
                u."companyId",
                c.name as company,
                u.created_at as entry_date,
                MAX(CASE WHEN ce.accepted = true THEN 1 ELSE 0 END) as accepted,
                date_part('month', u.created_at) as entry_month,
                u."surveyAnswered",
                url.created_at as realocation_date,
                date_part('month', url.created_at) as realocation_month,
                extract(day from (url.created_at - u.created_at)) as realocation_time,
                count(distinct mu) as collective_mentoring,
                count(distinct ss) as individual_mentoring,
                COALESCE((
                    SELECT SUM(spp."availableQuantity")
                    FROM "companyEmployees" ce
                    LEFT JOIN "subscriptionPlans" sp ON sp.name = ce."plan" 
                    LEFT JOIN "subscriptionPlanProducts" spp ON spp."subscriptionPlanId" = sp.id
                    WHERE ce."userId" = u.id
                        AND spp."productId" != '9ffbfd9d-82ff-43e3-806d-9928d9d4e764' 
                ), 0) AS available_products
                from users u 
                left join companies c 
                    on c.id = u."companyId" 
                left join users_realocated_logs url 
                    on url."userId" = u.id
                left join "mentoringUsers" mu 
                    on mu."userId" = u.id
                left join "specialistSchedule" ss 
                    on ss."userId" = u.id
                left join "companyEmployees" ce
                    on ce."userId" = u.id


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
