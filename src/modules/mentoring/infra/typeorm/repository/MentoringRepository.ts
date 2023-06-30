import { getRepository, Repository } from "typeorm";

import { IMentoringRepository } from "@modules/mentoring/repositories/IMentoringRepository";
import { Mentoring } from "../entities/Mentoring";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";

class MentoringRepository implements IMentoringRepository {
    private repository: Repository<Mentoring>;

    constructor() {
        this.repository = getRepository(Mentoring);
    }
    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
    async update(id: string, data: ICreateMentoringDTO): Promise<Mentoring> {
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
}

export { MentoringRepository };

