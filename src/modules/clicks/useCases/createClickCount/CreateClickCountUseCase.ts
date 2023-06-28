import { ClickCount } from "@modules/clicks/infra/typeorm/entities/ClickCount";
import { ClickCountRepository } from "@modules/clicks/infra/typeorm/repositories/ClickCountRepository";
import { ClickNamesRepository } from "@modules/clicks/infra/typeorm/repositories/ClickNamesRepository";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

interface ICreateClickCount {
    name: string;
}

@injectable()
class CreateClickCountUseCase {
    constructor(
        @inject("ClickNamesRepository")
        private clickNamesRepository: ClickNamesRepository,
        @inject("ClickCountRepository")
        private clickCountRepository: ClickCountRepository
    ) {}

    async execute({ name }: ICreateClickCount): Promise<ClickCount> {
        if (!name || name === "") {
            throw new AppError("Name can't be null");
        }

        let click_name_id = "";
        const clickName = await this.clickNamesRepository.findByName(name);

        if (!clickName) {
            const created = await this.clickNamesRepository.create({ name });
            click_name_id = created.id;
        } else {
            click_name_id = clickName.id;
        }

        const clickCount = await this.clickCountRepository.create({
            click_name_id,
        });

        return clickCount;
    }
}

export { CreateClickCountUseCase };

