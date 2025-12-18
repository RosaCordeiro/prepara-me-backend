import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { getRepository, Repository } from "typeorm";

class UsersReports {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async report() {
        const excludeProducts =
            "'2c6971b1-db05-4abd-9213-e0b1cb0663e1', 'df6194cb-c473-4f96-9af7-12343e45344f'";

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
                ce."manualCompany" as manual_company,  
                extract(day from (url.created_at - u.created_at)) as realocation_time,
                count(distinct mu) as collective_mentoring,
                count(
                	distinct case 
	                	when ss."dateSchedule" <= current_timestamp and ss."productId" not in (${excludeProducts}) then ss.id 
	                end
                ) as individual_mentoring_realized,
                COALESCE((
                    SELECT SUM(spp."availableQuantity")
                    FROM "companyEmployees" ce
                    LEFT JOIN "subscriptionPlans" sp ON sp.name = ce."plan" 
                    LEFT JOIN "subscriptionPlanProducts" spp ON spp."subscriptionPlanId" = sp.id
                    INNER JOIN "products" p2 ON p2.id = spp."productId"
                    WHERE ce."userId" = u.id
                        AND p2.id not in (${excludeProducts})
                ), 0) as individual_mentoring,
                max(case 
				    when exists (
				    	select upa.id from "userProductsAvailable" upa 
				    	inner join products p2 
				    	 	on p2.id = upa."productId"
				    	where p2.name = 'Papo Indicações' and upa."userId" = u.id
				    ) then 1 
				    else 0 
				end) = 1 as has_outplacement_mentoring,
                sum(case when trim(p."name") = 'Papo Indicações' and ss."dateSchedule" <= current_timestamp then 1 else 0 end) as outplacement_mentoring_realized
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
                left join "products" p
                    on p.id = ss."productId"
            group by
                u.id,
                c.name,
                url.created_at,
                ce."manualCompany"
            `
        );

        return response;
    }
}

export { UsersReports };
