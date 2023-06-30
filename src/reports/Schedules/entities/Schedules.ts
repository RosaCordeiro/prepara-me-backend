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
            where = ` where ss."dateSchedule" between '${initialDate}' and '${finalDate} 23:59:59'`;
        }

        const data: ISchedulesReport[] = await this.repository.query(`
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
            ss."dateSchedule" as data_agendamento,
            ss."dateSchedule" as data_servico,
            s."name" as especialista ,
            ss.rating as nota,
            case
                when u.realocated  = 'NOT_REALOCATED' then
                    'Não'
                else 
                    'Sim'
            end as recolocacao
            from users u 
            inner join "specialistSchedule" ss on ss."userId" = u.id 
            inner join specialists s on s.id  = ss."specialistId" 
            inner join products p on p.id = ss."productId" 
            ${where}
            order by ss."dateSchedule" 
        `);

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
}

export { Schedules };

