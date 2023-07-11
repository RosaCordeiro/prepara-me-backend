import { getRepository, Repository } from "typeorm";

import { IMentoringRepository } from "@modules/mentoring/repositories/IMentoringRepository";
import { Mentoring } from "../entities/Mentoring";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { IEditMentoringDTO } from "@modules/mentoring/dtos/IEditMentoring";
import { Specialist } from "@modules/specialists/infra/typeorm/entities/Specialist";

class MentoringRepository implements IMentoringRepository {
    private repository: Repository<Mentoring>;
    private repositorySpecialist: Repository<Specialist>;

    constructor() {
        this.repository = getRepository(Mentoring);
        this.repositorySpecialist = getRepository(Specialist);
    }
    async rateMentoring(
        id: string,
        idUser: string,
        rate: number
    ): Promise<void> {
        await this.repository.query(
            `update "mentoringUsers" set rating = ${rate} where "mentoringId" = '${id}' and "userId" = '${idUser}'`
        );
    }
    async findSchedule(
        userId: string,
        dateBegin: string,
        dateEnd: string,
        type: string
    ): Promise<any> {
        const schedule: any[] = await this.repository.query(
            `           
            select 
            mu."mentoringId" as id,
            null as status,
            null as comments,
            m."date" as dateSchedule,
            m."linkMeet" as hangoutLink,
            to_json(m.*) as product,
            mu."mentoringId" as productId,
            m."eventId"  as scheduleEventId,
            to_json(u.*) as user,
            u.id as "userId" ,
            to_json(s.*) as specialist,
            'id' as specialistId,
            mu.rating as rating
            from "mentoringUsers" mu 
            inner join users u on u.id = mu."userId" 
            inner join mentoring m on m.id = mu."mentoringId"
            inner join specialists s on s.id = m."mentorId" 
            where ${
                type === "user" ? 'mu."userId"' : 's."userId"'
            } = '${userId}' and m."date" between '${dateBegin}' and '${dateEnd} 23:59:59'
            `
        );

        schedule.forEach((item) => {
            const product = item.product;
            item.product = {
                id: product.id,
                name: product.title,
            };

            item.dateSchedule = item.dateschedule;
            delete item.dateschedule;

            item.hangoutLink = item.hangoutlink;
            delete item.hangoutlink;
        });

        return schedule;
    }

    async paginate(
        page: number,
        perPage: number,
        idUser?: string
    ): Promise<Pagination> {
        page = page - 1;
        if (page < 0) page = 0;

        const response = await this.repository.findAndCount({
            skip: page * perPage,
            take: perPage,
            relations: ["usersMentoring", "mentor"],
            order: {
                date: "DESC",
            },
        });

        const totalPages =
            response[1] % perPage === 0
                ? response[1] / perPage
                : parseInt((response[1] / perPage + 1).toString());

        const data = response[0];

        if (idUser !== undefined && idUser !== null && idUser !== "") {
            const user: any[] = await this.repository.query(
                `select * from "mentoringUsers" where "userId" = '${idUser}'`
            );

            data.forEach((item: any) => {
                const userParticipating = user.findIndex(
                    (user) =>
                        user.mentoringId === item.id && user.userId === idUser
                );

                item.participating = userParticipating !== -1;
            });
        }

        return {
            data: data,
            page: page + 1,
            perPage,
            pages: totalPages,
            total: response[1],
        };
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async update(id: string, content: IEditMentoringDTO): Promise<Mentoring> {
        console.log(content.mentorId);
        if (
            content.mentorId === undefined ||
            content.mentorId === null ||
            content.mentorId === ""
        ) {
            throw new Error("Specialist not found");
        }

        const specialist = await this.repositorySpecialist.findOne(
            content.mentorId
        );

        console.log(specialist);

        if (!specialist) {
            throw new Error("Specialist not found");
        }

        delete content.mentorId;

        return await this.repository.save({
            id,
            ...content,
            mentor: specialist,
        });
    }

    find(): Promise<Mentoring[]> {
        return this.repository.find({
            relations: ["usersMentoring", "mentor"],
        });
    }

    async create(content: ICreateMentoringDTO): Promise<Mentoring> {
        console.log("Chegou aqui");

        const specialist = await this.repositorySpecialist.findOne(
            content.mentorId
        );

        if (!specialist) {
            throw new Error("Specialist not found");
        }

        delete content.mentorId;

        const mentoring = this.repository.create({
            ...content,
            mentor: specialist,
        });

        await this.repository.save(mentoring);

        return mentoring;
    }

    async findById(id: string): Promise<Mentoring> {
        const mentoring = await this.repository.findOne(id, {
            relations: ["usersMentoring", "mentor"],
        });
        return mentoring;
    }
}

export interface Pagination {
    page: number;
    perPage: number;
    total: number;
    pages: number;
    data: any[];
}

export { MentoringRepository };

