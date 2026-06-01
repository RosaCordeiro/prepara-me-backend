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
            where = ` where row."data_servico" between '${initialDate}' and '${finalDate} 23:59:59'`;
        }

        const data: ISchedulesReport[] = await this.repository.query(`
            select * from (

                
                -- BLOCO 1: Conteúdo Livre (users)
                
                select
                    u."name" as name,
                    case when u."companyId" is not null then 'B2B' else 'B2C' end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT(cp_company1.name, ' - Patrocínio')
                        else
                            case when u."companyId" is not null then direct_company1.name else '-' end
                    end as empresa,
                    case when u."companyId" is not null then ce1."entryDate" else null end as periodo,
                    case when u."companyId" is not null then ce1.unity else '-' end as unidade,
                    case when u."companyId" is not null then ce1.department else '-' end as area,
                    case when u."companyId" is not null then ce1."position" else '-' end as cargo,
                    case when ce1.accepted is true then 'Sim' else 'Não' end as acolhimento_realizado,
                    ut1.created_at as primeiro_login,
                    case when u."surveyAnswered" then 'Sim' else 'Não' end as pesquisa_desligamento,
                    case when u."laborRiskAlert" = 'ALERT' then 'Sim' else 'Não' end as botao_vermelho,
                    'Conteúdo Livre' as servico,
                    null as mentoria_trocada,
                    null as mentoria_incluida,
                    null as data_troca,
                    null as data_agendamento,
                    TO_CHAR(u."created_at", 'YYYY-MM-DD HH24:MI:SS') as data_servico,
                    null as mes_ano,
                    '-' as especialista,
                    '-' as nota,
                    case
                        when u."companyId" is not null then
                            case when ce1.realocate is true then 'Sim' else 'Não' end
                        else '-'
                    end as recolocacao,
                    case when u."companyId" is not null then COALESCE(ce1."manualCompany", '') else null end as manual_company,
                    url1.created_at as data_realocacao,
                    null as data_envio_relatorio,
                    null as data_cancelamento,
                    null as razao_cancelamento,
                    case
                        when u."companyId" is not null then COALESCE(ce1."packageDeclined", false)
                        else null
                    end as package_declined,
                    1 as order,
                    u.created_at as data_criacao
                from users u
                left join lateral (
                    select ce."entryDate", ce.unity, ce.department, ce."position", ce.accepted, ce.realocate, ce."manualCompany", ce."packageDeclined"
                    from "companyEmployees" ce
                    where ce."userId" = u.id
                    limit 1
                ) ce1 on true
                left join lateral (
                    select c."name"
                    from "companyPage" cp
                    inner join companies c on c.id = cp."companyId"
                    where cp.name = u."companyNameSignIn"
                    limit 1
                ) cp_company1 on (u."companyNameSignIn" != '' and u."companyNameSignIn" is not null)
                left join lateral (
                    select c.name
                    from companies c
                    where c.id = u."companyId"
                    limit 1
                ) direct_company1 on (u."companyId" is not null)
                left join lateral (
                    select ut.created_at
                    from user_tokens ut
                    where ut.user_id = u.id
                    order by ut.created_at
                    limit 1
                ) ut1 on true
                left join lateral (
                    select url.created_at
                    from users_realocated_logs url
                    where url."userId" = u.id
                    limit 1
                ) url1 on true

                union

                
                -- BLOCO 2: Produtos disponíveis (userProductsAvailable)
                
                select
                    u."name" as name,
                    case when u."companyId" is not null then 'B2B' else 'B2C' end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT(cp_company2.name, ' - Patrocínio')
                        else
                            case when u."companyId" is not null then direct_company2.name else '-' end
                    end as empresa,
                    case when u."companyId" is not null then ce2."entryDate" else null end as periodo,
                    case when u."companyId" is not null then ce2.unity else '-' end as unidade,
                    case when u."companyId" is not null then ce2.department else '-' end as area,
                    case when u."companyId" is not null then ce2."position" else '-' end as cargo,
                    case when ce2.accepted is true then 'Sim' else 'Não' end as acolhimento_realizado,
                    ut2.created_at as primeiro_login,
                    case when u."surveyAnswered" then 'Sim' else 'Não' end as pesquisa_desligamento,
                    case when u."laborRiskAlert" = 'ALERT' then 'Sim' else 'Não' end as botao_vermelho,
                    case
                        when upal.id is not null then p_old.name
                        else p.name
                    end as servico,
                    case when upal.id is not null then 'Sim' else 'Não' end as mentoria_trocada,
                    case when upal."productIdNew" is not null then p_new.name else null end as mentoria_incluida,
                    upal.created_at as data_troca,
                    null as data_agendamento,
                    null as data_servico,
                    null as mes_ano,
                    '-' as especialista,
                    '-' as nota,
                    case
                        when u."companyId" is not null then
                            case when ce2.realocate is true then 'Sim' else 'Não' end
                        else '-'
                    end as recolocacao,
                    case when u."companyId" is not null then COALESCE(ce2."manualCompany", '') else null end as manual_company,
                    url2.created_at as data_realocacao,
                    null as data_envio_relatorio,
                    null as data_cancelamento,
                    null as razao_cancelamento,
                    case
                        when u."companyId" is not null then COALESCE(ce2."packageDeclined", false)
                        else null
                    end as package_declined,
                    2 as order,
                    u.created_at as data_criacao
                from "userProductsAvailable" upa
                inner join users u on u.id = upa."userId"
                inner join products p on p.id = upa."productId"
                left join lateral (
                    select upal_inner.*
                    from "userProductsAvailableLog" upal_inner
                    where upal_inner."userProductsAvailableId" = upa.id
                    order by upal_inner.id desc
                    limit 1
                ) upal on true
                left join products p_old on p_old.id = upal."productIdOld"
                left join products p_new on p_new.id = upal."productIdNew"
                left join lateral (
                    select ce."entryDate", ce.unity, ce.department, ce."position", ce.accepted, ce.realocate, ce."manualCompany", ce."packageDeclined"
                    from "companyEmployees" ce
                    where ce."userId" = u.id
                    limit 1
                ) ce2 on true
                left join lateral (
                    select c."name"
                    from "companyPage" cp
                    inner join companies c on c.id = cp."companyId"
                    where cp.name = u."companyNameSignIn"
                    limit 1
                ) cp_company2 on (u."companyNameSignIn" != '' and u."companyNameSignIn" is not null)
                left join lateral (
                    select c.name
                    from companies c
                    where c.id = u."companyId"
                    limit 1
                ) direct_company2 on (u."companyId" is not null)
                left join lateral (
                    select ut.created_at
                    from user_tokens ut
                    where ut.user_id = u.id
                    order by ut.created_at
                    limit 1
                ) ut2 on true
                left join lateral (
                    select url.created_at
                    from users_realocated_logs url
                    where url."userId" = u.id
                    limit 1
                ) url2 on true
                where upa."availableQuantity" > 0

                union

                
                -- BLOCO 3: Agendamentos (specialistSchedule)
                
                select
                    u."name" as name,
                    case when u."companyId" is not null then 'B2B' else 'B2C' end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT(cp_company3.name, ' - Patrocínio')
                        else
                            case when u."companyId" is not null then direct_company3.name else '-' end
                    end as empresa,
                    case when u."companyId" is not null then ce3."entryDate" else null end as periodo,
                    case when u."companyId" is not null then ce3.unity else '-' end as unidade,
                    case when u."companyId" is not null then ce3.department else '-' end as area,
                    case when u."companyId" is not null then ce3."position" else '-' end as cargo,
                    case when ce3.accepted is true then 'Sim' else 'Não' end as acolhimento_realizado,
                    ut3.created_at as primeiro_login,
                    case when u."surveyAnswered" then 'Sim' else 'Não' end as pesquisa_desligamento,
                    case when u."laborRiskAlert" = 'ALERT' then 'Sim' else 'Não' end as botao_vermelho,
                    p."name" as servico,
                    null as mentoria_trocada,
                    null as mentoria_incluida,
                    null as data_troca,
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as data_servico,
                    TO_CHAR(ss."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as mes_ano,
                    s."name" as especialista,
                    CAST(ss.rating as text) as nota,
                    case
                        when u."companyId" is not null then
                            case when ce3.realocate is true then 'Sim' else 'Não' end
                        else '-'
                    end as recolocacao,
                    case when u."companyId" is not null then COALESCE(ce3."manualCompany", '') else null end as manual_company,
                    url3.created_at as data_realocacao,
                    TO_CHAR(ssf3."createdAt", 'YYYY-MM-DD HH24:MI:SS') as data_envio_relatorio,
                    null as data_cancelamento,
                    null as razao_cancelamento,
                    case
                        when u."companyId" is not null then COALESCE(ce3."packageDeclined", false)
                        else null
                    end as package_declined,
                    3 as order,
                    u.created_at as data_criacao
                from users u
                inner join "specialistSchedule" ss on ss."userId" = u.id
                inner join specialists s on s.id = ss."specialistId"
                inner join products p on p.id = ss."productId"
                left join lateral (
                    select ce."entryDate", ce.unity, ce.department, ce."position", ce.accepted, ce.realocate, ce."manualCompany", ce."packageDeclined"
                    from "companyEmployees" ce
                    where ce."userId" = u.id
                    limit 1
                ) ce3 on true
                left join lateral (
                    select c."name"
                    from "companyPage" cp
                    inner join companies c on c.id = cp."companyId"
                    where cp.name = u."companyNameSignIn"
                    limit 1
                ) cp_company3 on (u."companyNameSignIn" != '' and u."companyNameSignIn" is not null)
                left join lateral (
                    select c.name
                    from companies c
                    where c.id = u."companyId"
                    limit 1
                ) direct_company3 on (u."companyId" is not null)
                left join lateral (
                    select ut.created_at
                    from user_tokens ut
                    where ut.user_id = u.id
                    order by ut.created_at
                    limit 1
                ) ut3 on true
                left join lateral (
                    select url.created_at
                    from users_realocated_logs url
                    where url."userId" = u.id
                    limit 1
                ) url3 on true
                left join lateral (
                    select MAX(ssf."createdAt") as "createdAt"
                    from "specialistScheduleFiles" ssf
                    where ssf."specialistScheduleId" = ss.id
                ) ssf3 on true

                union

                
                -- BLOCO 4: Mentorias coletivas (mentoringUsers)
                
                select
                    u."name" as name,
                    case when u."companyId" is not null then 'B2B' else 'B2C' end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT(cp_company4.name, ' - Patrocínio')
                        else
                            case when u."companyId" is not null then direct_company4.name else '-' end
                    end as empresa,
                    case when u."companyId" is not null then ce4."entryDate" else null end as periodo,
                    case when u."companyId" is not null then ce4.unity else '-' end as unidade,
                    case when u."companyId" is not null then ce4.department else '-' end as area,
                    case when u."companyId" is not null then ce4."position" else '-' end as cargo,
                    case when ce4.accepted is true then 'Sim' else 'Não' end as acolhimento_realizado,
                    ut4.created_at as primeiro_login,
                    case when u."surveyAnswered" then 'Sim' else 'Não' end as pesquisa_desligamento,
                    case when u."laborRiskAlert" = 'ALERT' then 'Sim' else 'Não' end as botao_vermelho,
                    'Mentoria Coletiva' as servico,
                    null as mentoria_trocada,
                    null as mentoria_incluida,
                    null as data_troca,
                    TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                    TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS') as data_servico,
                    TO_CHAR(m."date", 'YYYY-MM-DD HH24:MI:SS') as mes_ano,
                    s."name" as especialista,
                    CAST(mu.rating as text) as nota,
                    case
                        when u."companyId" is not null then
                            case when ce4.realocate is true then 'Sim' else 'Não' end
                        else '-'
                    end as recolocacao,
                    case when u."companyId" is not null then COALESCE(ce4."manualCompany", '') else null end as manual_company,
                    url4.created_at as data_realocacao,
                    null as data_envio_relatorio,
                    null as data_cancelamento,
                    null as razao_cancelamento,
                    case
                        when u."companyId" is not null then COALESCE(ce4."packageDeclined", false)
                        else null
                    end as package_declined,
                    4 as order,
                    u.created_at as data_criacao
                from "mentoringUsers" mu
                inner join users u on u.id = mu."userId"
                inner join mentoring m on m.id = mu."mentoringId"
                inner join specialists s on s.id = m."mentorId"
                left join lateral (
                    select ce."entryDate", ce.unity, ce.department, ce."position", ce.accepted, ce.realocate, ce."manualCompany", ce."packageDeclined"
                    from "companyEmployees" ce
                    where ce."userId" = u.id
                    limit 1
                ) ce4 on true
                left join lateral (
                    select c."name"
                    from "companyPage" cp
                    inner join companies c on c.id = cp."companyId"
                    where cp.name = u."companyNameSignIn"
                    limit 1
                ) cp_company4 on (u."companyNameSignIn" != '' and u."companyNameSignIn" is not null)
                left join lateral (
                    select c.name
                    from companies c
                    where c.id = u."companyId"
                    limit 1
                ) direct_company4 on (u."companyId" is not null)
                left join lateral (
                    select ut.created_at
                    from user_tokens ut
                    where ut.user_id = u.id
                    order by ut.created_at
                    limit 1
                ) ut4 on true
                left join lateral (
                    select url.created_at
                    from users_realocated_logs url
                    where url."userId" = u.id
                    limit 1
                ) url4 on true

                union

                
                -- BLOCO 5: Cancelamentos (specialistScheduleCancel)
              
                select
                    u."name" as name,
                    case when u."companyId" is not null then 'B2B' else 'B2C' end as origem,
                    case
                        when u."companyNameSignIn" != '' and u."companyNameSignIn" is not null then
                            CONCAT(cp_company5.name, ' - Patrocínio')
                        else
                            case when u."companyId" is not null then direct_company5.name else '-' end
                    end as empresa,
                    case when u."companyId" is not null then ce5."entryDate" else null end as periodo,
                    case when u."companyId" is not null then ce5.unity else '-' end as unidade,
                    case when u."companyId" is not null then ce5.department else '-' end as area,
                    case when u."companyId" is not null then ce5."position" else '-' end as cargo,
                    case when ce5.accepted is true then 'Sim' else 'Não' end as acolhimento_realizado,
                    ut5.created_at as primeiro_login,
                    case when u."surveyAnswered" then 'Sim' else 'Não' end as pesquisa_desligamento,
                    case when u."laborRiskAlert" = 'ALERT' then 'Sim' else 'Não' end as botao_vermelho,
                    concat('CANCELADO - ', p."name") as servico,
                    null as mentoria_trocada,
                    null as mentoria_incluida,
                    null as data_troca,
                    TO_CHAR(ssc."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as data_agendamento,
                    TO_CHAR(ssc."dateSchedule", 'YYYY-MM-DD HH24:MI:SS') as data_servico,
                    null as mes_ano,
                    s."name" as especialista,
                    null as nota,
                    case
                        when u."companyId" is not null then
                            case when ce5.realocate is true then 'Sim' else 'Não' end
                        else '-'
                    end as recolocacao,
                    case when u."companyId" is not null then COALESCE(ce5."manualCompany", '') else null end as manual_company,
                    url5.created_at as data_realocacao,
                    null as data_envio_relatorio,
                    TO_CHAR(ssc."created_at", 'YYYY-MM-DD HH24:MI:SS') as data_cancelamento,
                    ssc."reason" as razao_cancelamento,
                    case
                        when u."companyId" is not null then COALESCE(ce5."packageDeclined", false)
                        else null
                    end as package_declined,
                    5 as order,
                    u.created_at as data_criacao
                from "specialistScheduleCancel" ssc
                inner join users u on u.id = ssc."userId"
                inner join specialists s on s.id = ssc."specialistId"
                inner join products p on p.id = ssc."productId"
                left join lateral (
                    select ce."entryDate", ce.unity, ce.department, ce."position", ce.accepted, ce.realocate, ce."manualCompany", ce."packageDeclined"
                    from "companyEmployees" ce
                    where ce."userId" = u.id
                    limit 1
                ) ce5 on true
                left join lateral (
                    select c."name"
                    from "companyPage" cp
                    inner join companies c on c.id = cp."companyId"
                    where cp.name = u."companyNameSignIn"
                    limit 1
                ) cp_company5 on (u."companyNameSignIn" != '' and u."companyNameSignIn" is not null)
                left join lateral (
                    select c.name
                    from companies c
                    where c.id = u."companyId"
                    limit 1
                ) direct_company5 on (u."companyId" is not null)
                left join lateral (
                    select ut.created_at
                    from user_tokens ut
                    where ut.user_id = u.id
                    order by ut.created_at
                    limit 1
                ) ut5 on true
                left join lateral (
                    select url.created_at
                    from users_realocated_logs url
                    where url."userId" = u.id
                    limit 1
                ) url5 on true

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
    periodo: string;
    unidade: string;
    area: string;
    cargo: string;
    subarea: string;
    level: string;
    primeiro_login: string;
    pesquisa_desligamento: string;
    botao_vermelho: string;
    servico: string;
    mentoria_trocada: string;
    mentoria_incluida: string;
    data_troca: string;
    data_agendamento: string;
    data_servico: string;
    mes_ano: string;
    especialista: string;
    nota: number;
    recolocacao: string;
    data_realocacao: string;
    order?: number;
    data_envio_relatorio: string;
    data_cancelamento: string;
    razao_cancelamento: string;
    package_declined: string;
    data_criacao: string;
}

export { Schedules };
