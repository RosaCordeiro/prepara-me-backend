import { getRepository, Repository } from "typeorm";

import { IClickNamesRepository } from "@modules/clicks/repositories/IClickNamesRepository";
import { ClickNames } from "../entities/ClickNames";
import { ICreateClickNameDTO } from "@modules/clicks/dtos/ICreateClickNameDTO";
import { IResponseClickCountDTO } from "@modules/clicks/dtos/IResponseClickCountDTO";

class ClickNamesRepository implements IClickNamesRepository {
    private repository: Repository<ClickNames>;

    constructor() {
        this.repository = getRepository(ClickNames);
    }

    async find(): Promise<IResponseClickCountDTO[]> {
        const clickNames = await this.repository
            .createQueryBuilder("cn")
            .select("cn.name")
            .addSelect("COUNT(*)", "count")
            .leftJoin("click_count", "c", "c.click_name_id = cn.id")
            .groupBy("cn.name")
            .getRawMany();

        return clickNames;
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

