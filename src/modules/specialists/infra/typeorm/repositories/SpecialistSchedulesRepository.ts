import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { ISpecialistScheduleResponseDTO } from "@modules/specialists/dtos/ISpecialistScheduleResponseDTO";
import { SpecialistScheduleMap } from "@modules/specialists/mapper/SpecialistScheduleMap";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { getRepository, Repository } from "typeorm";
import { SpecialistSchedule } from "../entities/SpecialistSchedule";

class SpecialistSchedulesRepository implements ISpecialistSchedulesRepository {
    private repository: Repository<SpecialistSchedule>;

    constructor() {
        this.repository = getRepository(SpecialistSchedule);
    }
    findById(id: string): Promise<SpecialistSchedule> {
        return this.repository.findOne(id);
    }

    async create({
        dateSchedule,
        specialistId,
        status,
        userId,
        productId,
        comments,
        hangoutLink,
        scheduleEventId,
        id,
        rating,
    }: ICreateSpecialistScheduleDTO): Promise<SpecialistSchedule> {
        const specialistSchedule = this.repository.create({
            dateSchedule,
            specialistId,
            status,
            productId,
            userId,
            comments,
            hangoutLink,
            scheduleEventId,
            id,
            rating,
        });

        await this.repository.save(specialistSchedule);

        return specialistSchedule;
    }

    async find({
        dateBegin,
        dateEnd,
        userId,
        status,
        productId,
        specialistId,
        specialistUserId,
        id,
        dateSchedule,
    }: {
        dateBegin?: Date;
        dateEnd?: Date;
        userId?: string;
        status?: string;
        productId?: string;
        specialistId?: string;
        specialistUserId?: string;
        id?: string;
        dateSchedule?: Date;
    }): Promise<ISpecialistScheduleResponseDTO[]> {
        const specialistSchedulesQuery = this.repository
            .createQueryBuilder("ss")
            .loadRelationCountAndMap(
                "ss.filesCountUser",
                "ss.specialistScheduleFiles",
                "ssf",
                (qb) => qb.where("ssf.fileType = 'USER'")
            )
            .loadRelationCountAndMap(
                "ss.filesCountSpecialist",
                "ss.specialistScheduleFiles",
                "ssf",
                (qb) => qb.where("ssf.fileType = 'SPECIALIST'")
            )
            .leftJoinAndSelect("ss.user", "u")
            .leftJoinAndSelect("ss.specialist", "s")
            .leftJoinAndSelect("s.user", "su")
            .leftJoinAndSelect("ss.product", "p")
            .orderBy("ss.dateSchedule", "ASC");

        if (id) {
            specialistSchedulesQuery.andWhere("ss.id = :id", { id });
        } else {
            if (status) {
                specialistSchedulesQuery.andWhere("ss.status = :status", {
                    status,
                });

                if (status === "UNAVAILABLE") {
                    specialistSchedulesQuery.andWhere("ss.userId IS NOT NULL");
                    specialistSchedulesQuery.andWhere(
                        "ss.productId IS NOT NULL"
                    );
                }
            }

            if (userId) {
                specialistSchedulesQuery.andWhere("ss.userId = :userId", {
                    userId,
                });
            }

            if (specialistUserId) {
                specialistSchedulesQuery.andWhere("s.userId = :userId", {
                    userId: specialistUserId,
                });
            }

            if (specialistId) {
                specialistSchedulesQuery.andWhere(
                    "ss.specialistId = :specialistId",
                    {
                        specialistId,
                    }
                );
            }

            if (productId) {
                specialistSchedulesQuery.andWhere("ss.productId = :productId", {
                    productId,
                });
            }

            if (dateBegin && dateEnd) {
                specialistSchedulesQuery.andWhere(
                    "ss.dateSchedule between :dateBegin and :dateEnd",
                    {
                        dateBegin,
                        dateEnd,
                    }
                );
            }

            if (dateSchedule) {
                specialistSchedulesQuery.andWhere(
                    "ss.dateSchedule = :dateSchedule",
                    {
                        dateSchedule: dateSchedule,
                    }
                );
            }
        }

        const specialistSchedules = await specialistSchedulesQuery.getMany();

        console.log(specialistSchedules);

        const specialistSchedulesMapped = specialistSchedules.map(
            (specialistSchedule) => {
                return SpecialistScheduleMap.toDTO(specialistSchedule);
            }
        );

        return specialistSchedulesMapped;
    }
    async remove(id: string): Promise<string> {
        this.repository.delete(id);

        return id;
    }
    async findToUser({ dateBegin, dateEnd, specialistId }): Promise<any> {
        let where = 'where extract(minute from ss."dateSchedule") <> 30';
        if (dateBegin && dateEnd) {
            const formattedDateBegin = new Date(dateBegin).toISOString();
            const formattedDateEnd = new Date(dateEnd).toISOString();
            where += ` and ss."dateSchedule" between '${formattedDateBegin}' and '${formattedDateEnd}'`;
        }
        if (specialistId) {
            where += ` and ss."specialistId" = '${specialistId}'`;
        }

        const specialistSchedules = await this.repository.query(
            `select 
                ss."id",
                ss."dateSchedule",
                ss."specialistId",
                ss."userId",
                ss."productId",
                ss."comments",
                ss."hangoutLink",
                ss."scheduleEventId",
                ss.rating,
                case 
                    when extract(minute from ss."dateSchedule") = 30
                        then 'UNAVAILABLE'
                    when extract(minute from ss."dateSchedule") = 0
                        then
                            case
                                when exists (
                                    select 1 
                                    from "specialistSchedule" ss2
                                    where ss2."dateSchedule" = ss."dateSchedule" + interval '30 minutes'
                                    and ss2."status" = 'UNAVAILABLE'
                                    and ss2."specialistId" = ss."specialistId"
                                ) 
                                    then 'UNAVAILABLE'
                                    else 
                                        case 
                                            when ss."status" = 'AVAILABLE'
                                            then 'AVAILABLE'
                                            else 'UNAVAILABLE'
                                    end
                            end
                end as status,
                jsonb_build_object(
                    'id', s.id,
                    'name', s.name,
                    'bio', s.bio,
                    'status', s.status,
                    'userId', s."userId",
                    'linkedinUrl', s."linkedinUrl",
                    'image', s.image,
                    'user', jsonb_build_object(
                        'id', u.id,
                        'name', u.name,
                        'username', u.username,
                        'email', u.email,
                        'documentId', u."documentId",
                        'type', u.type,
                        'status', u.status,
                        'laborRisk', u."laborRisk",
                        'NPSSurvey', u."NPSSurvey",
                        'surveyAnswered', u."surveyAnswered",
                        'companyId', u."companyId",
                        'realocated', u."realocated",
                        'feelingsMapJSON', u."feelingsMapJSON",
                        'brandRisk', u."brandRisk",
                        'laborRiskJSON', u."laborRiskJSON",
                        'brandRiskJSON', u."brandRiskJSON",
                        'laborRiskAlert', u."laborRiskAlert",
                        'expiresDate', u."expiresDate",
                        'periodTest', u."periodTest",
                        'subscribeToken', u."subscribeToken",
                        'companyNameSignIn', u."companyNameSignIn",
                        'password', u."password",
                        'avatar', u.avatar,
                        'created_at', u."created_at"
                    )
                ) as specialist,
                case 
                    when ss."userId" is not null 
                    then jsonb_build_object(
                        'id', u2.id,
                        'name', u2.name,
                        'email', u2.email,
                        'username', u2.username,
                        'avatar', u2.avatar,
                        'created_at', u2."created_at",
                        'status', u2.status,
                        'documentId', u2."documentId",
                        'type', u2.type,
                        'avatarUrl', u2.avatar,
                        'NPSSurvey', u2."NPSSurvey",
                        'laborRisk', u2."laborRisk",
                        'surveyAnswered', u2."surveyAnswered",
                        'companyId', u2."companyId",
                        'realocated', u2."realocated",
                        'feelingsMapJSON', u2."feelingsMapJSON",
                        'brandRisk', u2."brandRisk",
                        'laborRiskJSON', u2."laborRiskJSON",
                        'brandRiskJSON', u2."brandRiskJSON",
                        'laborRiskAlert', u2."laborRiskAlert",
                        'expiresDate', u2."expiresDate",
                        'periodTest', u2."periodTest",
                        'subscribeToken', u2."subscribeToken",
                        'companyNameSignIn', u2."companyNameSignIn",
                        'companyNameSignInLogo', ''
                    )
                    else null
                end as "user",
                case when ss."productId" is not null 
                    then jsonb_build_object(
                        'id', p.id,
                        'name', p.name,
                        'shortName', p."shortName",
                        'status', p.status,
                        'type', p.type,
                        'bestSeller', p."bestSeller",
                        'price', p.price,
                        'duration', p.duration,
                        'slug', p.slug,
                        'onlyAdmin', p."onlyAdmin"
                    ) 
                    else null
                end as "product"		
            from 
                "specialistSchedule" ss
            left join specialists s 
                on s.id = ss."specialistId"
            left join "users" u
                on u.id = s."userId"
            left join "users" u2
                on u2.id = ss."userId"
            left join products p  
                on p.id = ss."productId"
            ${where}
            group by 
                ss."id", s.id, u.id, u2.id, p.id
            order by
                ss."dateSchedule" asc    
            `
        );
        const specialistSchedulesMapped = specialistSchedules.map(
            (specialistSchedule) => {
                return SpecialistScheduleMap.toDTO(specialistSchedule);
            }
        );

        return specialistSchedulesMapped;
    }
}

export { SpecialistSchedulesRepository };
