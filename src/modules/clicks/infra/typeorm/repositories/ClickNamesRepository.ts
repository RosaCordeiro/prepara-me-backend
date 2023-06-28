import { getRepository, Repository } from "typeorm";

import { IClickNamesRepository } from "@modules/clicks/repositories/IClickNamesRepository";
import { ClickNames } from "../entities/ClickNames";
import { ICreateClickNameDTO } from "@modules/clicks/dtos/ICreateClickNameDTO";

class ClickNamesRepository implements IClickNamesRepository {
    private repository: Repository<ClickNames>;

    constructor() {
        this.repository = getRepository(ClickNames);
    }

    async create({ name }: ICreateClickNameDTO): Promise<ClickNames> {
        const clickNames = this.repository.create({
            name,
        });

        await this.repository.save(clickNames);

        return clickNames;
    }

    async findByName(name: string): Promise<ClickNames> {
        const clickNames = await this.repository.findOne({ name });

        return clickNames;
    }
}

export { ClickNamesRepository };

