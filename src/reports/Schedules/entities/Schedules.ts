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
                        when u."subscribeToken" != '' then
                            'B2B'
                        else 
                            'B2C'
                    end as origem,
                    case
                        when u."subscribeToken" != '' then
                            u."subscribeToken"
                        else 
                            '-'
                    end as empresa,
                    case
                        when (
                            select 
                            created_at  
                            from user_tokens ut 
                            where ut.user_id = U.id  
                            order by created_at 
                            limit 1 
                        ) isnull then
                            'Não'
                        else 
                            'Sim'
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
                    null as data_agendamento,
                    null as data_servico,
                    '-' as especialista ,
                    '-' as nota,
                    '-' as recolocacao,
                    1 as order 
                from users u 
                
                union
                
                select 
                    u."name" as name,
                    case
                        when u."subscribeToken" != '' then
                            'B2B'
                        else 
                            'B2C'
                    end as origem,
                    case
                        when u."subscribeToken" != '' then
                            u."subscribeToken"
                        else 
                            '-'
                    end as empresa,
                    case
                        when (
                            select 
                            created_at  
                            from user_tokens ut 
                            where ut.user_id = U.id  
                            order by created_at 
                            limit 1 
                        ) isnull then
                            'Não'
                        else 
                            'Sim'
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
                    null as data_agendamento,
                    null as data_servico,
                    '-' as especialista ,
                    '-' as nota,
                    '-' as recolocacao,
                    2 as order
                from "userProductsAvailable" upa 
                inner join users u on u.id = upa."userId"  
                inner join products p on p.id = upa."productId" 
                where upa."availableQuantity" > 0	
                
                union 
                
                select 
                    u."name" as name,
                    case
                        when u."subscribeToken" != '' then
                            'B2B'
                        else 
                            'B2C'
                    end as origem,
                    case
                        when u."subscribeToken" != '' then
                            u."subscribeToken"
                        else 
                            '-'
                    end as empresa,
                    case
                        when (
                            select 
                            created_at  
                            from user_tokens ut 
                            where ut.user_id = U.id  
                            order by created_at 
                            limit 1 
                        ) isnull then
                            'Não'
                        else 
                            'Sim'
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
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS')  as data_servico,
                    s."name" as especialista ,
                    CAST(ss.rating as text) as nota,
                    case
                        when u.realocated  = 'NOT_REALOCATED' then
                            'Não'
                        else 
                            'Sim'
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
                    when u."subscribeToken" != '' then
                        'B2B'
                    else 
                        'B2C'
                end as origem,
                case
                    when u."subscribeToken" != '' then
                        u."subscribeToken"
                    else 
                        '-'
                end as empresa,
                case
                    when (
                        select 
                        created_at  
                        from user_tokens ut 
                        where ut.user_id = U.id  
                        order by created_at 
                        limit 1 
                    ) isnull then
                        'Não'
                    else 
                        'Sim'
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
                'Mentorial Coletiva' as servico,
                TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS')  as data_servico,
                CAST(m."mentorId" as text) as especialista,
                CAST(mu.rating as text) as nota,
                case
                    when u.realocated  = 'NOT_REALOCATED' then
                        'Não'
                    else 
                        'Sim'
                end as recolocacao,
                4 as order
                from "mentoringUsers" mu 
                inner join users u on u.id = mu."userId" 
                inner join mentoring m on m.id = mu."mentoringId" 
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
    data_agendamento: string;
    data_servico: string;
    especialista: string;
    nota: number;
    recolocacao: string;
    order: number;
}

export { Schedules };

