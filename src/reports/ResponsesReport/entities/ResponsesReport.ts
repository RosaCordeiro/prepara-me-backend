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
                    when ce.id is not null then
                    	(select c2."name" from companies c2 where c2.id = ce."companyId")
                    else
                        case
                            when u."companyId" is not null then
                                (select c.name from companies c where c.id = u."companyId")
                            else 
                                    '-'
                            end           
                end as empresa,
                case
                    when u."companyId" is not null then
                        (
                            select 
                                ce."entryDate"  
                            from "companyEmployees" ce 
                            where "userId" = U.id   
                        )
                    else 
                        null
                end as periodo,   
                case
                    when u."companyId" is not null then
                    (
                        select 
                            ce.unity  
                        from "companyEmployees" ce 
                        where "userId" = U.id   
                    
                    )                
                    else 
                        '-'
                end as unidade,   
                case
                    when u."companyId" is not null then
                        (
                            select 
                                ce.department  
                            from "companyEmployees" ce 
                            where "userId" = U.id               	
                        )                
                    else 
                        '-'
                end as area, 
                case
                    when u."companyId" is not null then
                        (
                            select 
                                ce."position"  
                            from "companyEmployees" ce 
                            where "userId" = U.id               	
                        )                
                    else 
                        '-'
                end as cargo, 
                u.email, 
                u."feelingsMapJSON", 
                u."laborRiskJSON", 
                u."brandRiskJSON", 
                u."NPSSurvey",
                u."surveyQuestion"
            from users u 
            left join "companyEmployees" ce on ce."userId" = u.id
            where u."surveyAnswered" 
            ${additionalQuery};
        `);

        return responses;
    }
}

export { ResponsesReport };
