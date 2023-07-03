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
        return this.repository.find();
    }

    async create(content: ICreateMentoringDTO): Promise<Mentoring> {
        const mentoring: Mentoring = this.repository.create(content);
        await this.repository.save(mentoring);

        return mentoring;
    }

    async findById(id: string): Promise<Mentoring> {
        const mentoring = await this.repository.findOne(id);
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

