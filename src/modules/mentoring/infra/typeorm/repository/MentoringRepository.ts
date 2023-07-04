import { getRepository, Repository } from "typeorm";

import { IMentoringRepository } from "@modules/mentoring/repositories/IMentoringRepository";
import { Mentoring } from "../entities/Mentoring";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { IEditMentoringDTO } from "@modules/mentoring/dtos/IEditMentoring";

class MentoringRepository implements IMentoringRepository {
    private repository: Repository<Mentoring>;

    constructor() {
        this.repository = getRepository(Mentoring);
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
        dateEnd: string
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
            m.mentor as specialist,
            'id' as specialistId,
            mu.rating as rating
            from "mentoringUsers" mu 
            inner join users u on u.id = mu."userId" 
            inner join mentoring m on m.id = mu."mentoringId" 
            where mu."userId" = '${userId}' and m."date" between '${dateBegin}' and '${dateEnd} 23:59:59'
            `
        );

        schedule.forEach((item) => {
            const product = item.product;
            item.product = {
                id: product.id,
                name: product.title,
            };

            const specialist = item.specialist;
            item.specialist = {
                id: specialist,
                name: specialist,
            };

            item.dateSchedule = item.dateschedule;
            delete item.dateschedule;

            item.hangoutLink = item.hangoutlink;
            delete item.hangoutlink;
        });

        return schedule;
    }

    async paginate(page: number, perPage: number): Promise<Pagination> {
        page = page - 1;
        if (page < 0) page = 0;

        const response = await this.repository.findAndCount({
            skip: page * perPage,
            take: perPage,
        });

        const totalPages =
            response[1] % perPage === 0
                ? response[1] / perPage
                : parseInt((response[1] / perPage + 1).toString());

        return {
            data: response[0],
            page: page + 1,
            perPage,
            pages: totalPages,
            total: response[1],
        };
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async update(id: string, data: IEditMentoringDTO): Promise<Mentoring> {
        return await this.repository.save({
            id,
            ...data,
        });
    }

    find(): Promise<Mentoring[]> {
        return this.repository.find({
            relations: ["usersMentoring"],
        });
    }

    async create(content: ICreateMentoringDTO): Promise<Mentoring> {
        const mentoring: Mentoring = this.repository.create(content);

        console.log(mentoring);

        await this.repository.save(mentoring);

        return mentoring;
    }

    async findById(id: string): Promise<Mentoring> {
        const mentoring = await this.repository.findOne(id, {
            relations: ["usersMentoring"],
        });
        return mentoring;
    }
}

export interface Pagination {
    page: number;
    perPage: number;
    total: number;
    pages: number;
    data: Mentoring[];
}

export { MentoringRepository };

