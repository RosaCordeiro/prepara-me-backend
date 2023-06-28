import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";

import { getRepository, Repository } from "typeorm";

import { ClickNames } from "../entities/ClickNames";
import { IClickCountRepository } from "@modules/clicks/repositories/IClickCountRepository";
import { ICreateClickCountDTO } from "@modules/clicks/dtos/ICreateClickCountDTO";
import { ClickCount } from "../entities/ClickCount";

class ClickCountRepository implements IClickCountRepository {
    private repository: Repository<ClickCount>;

    constructor() {
        this.repository = getRepository(ClickCount);
    }
    async create({ click_name_id }: ICreateClickCountDTO): Promise<ClickCount> {
        const clickCount: ClickCount = this.repository.create({
            click_name_id,
        });

        await this.repository.save(clickCount);

        return clickCount;
    }
}

export { ClickCountRepository };

