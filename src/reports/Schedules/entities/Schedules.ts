import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { getRepository, Repository } from "typeorm";

class Schedules {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async report(
        initialDate?: string,
        finalDate?: string
    ): Promise<ISchedulesReport[]> {
        let where = ``;

        if (
            initialDate !== undefined &&
            finalDate !== undefined &&
            initialDate !== "" &&
            finalDate !== "" &&
            initialDate !== null &&
            finalDate !== null &&
            initialDate !== "null" &&
            finalDate !== "null" &&
            initialDate !== "undefined" &&
            finalDate !== "undefined"
        ) {
            where = ` where row."primeiro_login" between '${initialDate}' and '${finalDate} 23:59:59'`;
        }

        const data: ISchedulesReport[] = await this.repository.query(`
            select * from (
                select 
                    u."name" as name,
                    case
                        when u."companyId" is not null then
                            'B2B'
                        else 
                            'B2C'
                    end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT((select c."name" from "companyPage" cp  inner join companies c on c.id = cp."companyId" where cp.name = u."companyNameSignIn" limit 1), ' - Patrocínio')
                        else
                            case
                                when u."companyId" is not null then
                                    (select c.name from companies c where c.id = u."companyId")
                                else 
                                    '-'
                            end           
                    end as empresa,
                    case
                        when (
                            select 
                            accepted 
                            from "companyEmployees" ce 
                            where "userId" = U.id                        
                        ) is true then
                            'Sim'
                        else 
                            'Não'
                    end as acolhimento_realizado,
                    (
                        select 
                        created_at  
                        from user_tokens ut 
                        where ut.user_id = U.id  
                        order by created_at 
                        limit 1 
                    ) as primeiro_login,
                    case
                        when u."surveyAnswered" then
                            'Sim'
                        else 
                            'Não'
                    end as pesquisa_desligamento,
                    case
                        when u."laborRiskAlert" = 'ALERT' then
                            'Sim'
                        else 
                            'Não'
                    end as botao_vermelho,
                    'Conteúdo Livre' as servico,
                    null as mentoria_trocada,
                    null as mentoria_incluida,
                    null as data_troca,
                    null as data_agendamento,
                    null as data_servico,
                    '-' as especialista ,
                    '-' as nota,
                    case
                        when u."companyId" is not null then
                            case when (select ce.realocate from "companyEmployees" ce where ce."userId" = u.id) is true then 
                                'Sim'
                            else 
                                'Não'
                            end
                        else 
                            '-'
                    end as recolocacao,
                    1 as order 
                from users u 
                
                union
                
                select 
                    u."name" as name,
                    case
                        when u."companyId" is not null then
                            'B2B'
                        else 
                            'B2C'
                    end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT((select c."name" from "companyPage" cp  inner join companies c on c.id = cp."companyId" where cp.name = u."companyNameSignIn" limit 1), ' - Patrocínio')
                        else
                            case
                                when u."companyId" is not null then
                                    (select c.name from companies c where c.id = u."companyId")
                                else 
                                    '-'
                            end           
                    end as empresa,
                    case
                        when (
                            select 
                            accepted 
                            from "companyEmployees" ce 
                            where "userId" = U.id                        
                        ) is true then
                            'Sim'
                        else 
                            'Não'
                    end as acolhimento_realizado,
                    (
                        select 
                        created_at  
                        from user_tokens ut 
                        where ut.user_id = U.id  
                        order by created_at 
                        limit 1 
                    ) as primeiro_login,
                    case
                        when u."surveyAnswered" then
                            'Sim'
                        else 
                            'Não'
                    end as pesquisa_desligamento,
                    case
                        when u."laborRiskAlert" = 'ALERT' then
                            'Sim'
                        else 
                            'Não'
                    end as botao_vermelho,
                    case
                        when upal.id is not	null then
                            (select p2."name" from products p2 where id = upal."productIdOld") 
                        else 
                            p."name"
                    end as servico,
                    case
                        when upal.id is not	null then
                            'Sim'
                        else 
                            'Não'
                    end as mentoria_trocada,
                    case
                        when upal."productIdNew" is not	null then
                            (select p."name" from products where id = upal."productIdNew") 
                        else 
                            null
                    end as mentoria_incluida,
                    upal.created_at as data_troca,
                    null as data_agendamento,
                    null as data_servico,
                    '-' as especialista ,
                    '-' as nota,
                    case
                        when u."companyId" is not null then
                            case when (select ce.realocate from "companyEmployees" ce where ce."userId" = u.id) is true then 
                                'Sim'
                            else 
                                'Não'
                            end
                        else 
                            '-'
                    end as recolocacao,  
                    2 as order
                from "userProductsAvailable" upa 
                inner join users u on u.id = upa."userId"  
                inner join products p on p.id = upa."productId" 
                left join "userProductsAvailableLog" upal on upal."userProductsAvailableId" = upa.id	
                where upa."availableQuantity" > 0	
                
                union 
                
                select 
                    u."name" as name,
                    case
                        when u."companyId" is not null then
                            'B2B'
                        else 
                            'B2C'
                    end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT((select c."name" from "companyPage" cp  inner join companies c on c.id = cp."companyId" where cp.name = u."companyNameSignIn" limit 1), ' - Patrocínio')
                        else
                            case
                                when u."companyId" is not null then
                                    (select c.name from companies c where c.id = u."companyId")
                                else 
                                    '-'
                            end           
                    end as empresa,          
                    case
                        when (
                            select 
                            accepted 
                            from "companyEmployees" ce 
                            where "userId" = U.id                        
                        ) is true then
                            'Sim'
                        else 
                            'Não'
                    end as acolhimento_realizado,
                    (
                        select 
                        created_at  
                        from user_tokens ut 
                        where ut.user_id = U.id  
                        order by created_at 
                        limit 1 
                    ) as primeiro_login,
                    case
                        when u."surveyAnswered" then
                            'Sim'
                        else 
                            'Não'
                    end as pesquisa_desligamento,
                    case
                        when u."laborRiskAlert" = 'ALERT' then
                            'Sim'
                        else 
                            'Não'
                    end as botao_vermelho,
                    p."name" as servico,                    
                    null as mentoria_trocada,
                    null as mentoria_incluida,
                    null as data_troca,
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS')  as data_servico,
                    s."name" as especialista ,
                    CAST(ss.rating as text) as nota,
                    case
                        when u."companyId" is not null then
                            case when (select ce.realocate from "companyEmployees" ce where ce."userId" = u.id) is true then 
                                'Sim'
                            else 
                                'Não'
                            end
                        else 
                            '-'
                    end as recolocacao,                                        
                    3 as order
                from users u 
                inner join "specialistSchedule" ss on ss."userId" = u.id 
                inner join specialists s on s.id  = ss."specialistId" 
                inner join products p on p.id = ss."productId" 

                UNION

                select 
                u."name" as name,
                case
                    when u."companyId" is not null then
                        'B2B'
                    else 
                        'B2C'
                end as origem,
                case
                    when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                        CONCAT((select c."name" from "companyPage" cp  inner join companies c on c.id = cp."companyId" where cp.name = u."companyNameSignIn" limit 1), ' - Patrocínio')
                    else
                        case
                            when u."companyId" is not null then
                                (select c.name from companies c where c.id = u."companyId")
                            else 
                                '-'
                        end           
                end as empresa,
                case
                    when (
                        select 
                        accepted 
                        from "companyEmployees" ce 
                        where "userId" = U.id                        
                    ) is true then
                        'Sim'
                    else 
                        'Não'
                end as acolhimento_realizado,
                (
                    select 
                    created_at  
                    from user_tokens ut 
                    where ut.user_id = U.id  
                    order by created_at 
                    limit 1 
                ) as primeiro_login,
                case
                    when u."surveyAnswered" then
                        'Sim'
                    else 
                        'Não'
                end as pesquisa_desligamento,
                case
                    when u."laborRiskAlert" = 'ALERT' then
                        'Sim'
                    else 
                        'Não'
                end as botao_vermelho,
                'Mentoria Coletiva' as servico,                
                null as mentoria_trocada,
                null as mentoria_incluida,
                null as data_troca,
                TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS')  as data_servico,
                s."name" as especialista,
                CAST(mu.rating as text) as nota,
                case
                    when u."companyId" is not null then
                        case when (select ce.realocate from "companyEmployees" ce where ce."userId" = u.id) is true then 
                            'Sim'
                        else 
                            'Não'
                        end
                    else 
                        '-'
                end as recolocacao,                                
                4 as order
                from "mentoringUsers" mu 
                inner join users u on u.id = mu."userId" 
                inner join mentoring m on m.id = mu."mentoringId"
                inner join specialists s on s.id = m."mentorId" 
            ) as row 
            ${where}
            order by row.name, row.order            
        `);

        data.forEach((item) => {
            delete item.order;
        });

        return data;
    }
}

export interface ISchedulesReport {
    name: string;
    origem: string;
    empresa: string;
    primeiro_login: string;
    pesquisa_desligamento: string;
    botao_vermelho: string;
    servico: string;
    mentoria_trocada: string;
    mentoria_incluida: string;
    data_troca: string;
    data_agendamento: string;
    data_servico: string;
    especialista: string;
    nota: number;
    recolocacao: string;
    order: number;
}

export { Schedules };
