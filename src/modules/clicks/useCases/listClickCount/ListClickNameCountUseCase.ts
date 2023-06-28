import { IResponseClickCountDTO } from "@modules/clicks/dtos/IResponseClickCountDTO";
import { ClickNamesRepository } from "@modules/clicks/infra/typeorm/repositories/ClickNamesRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class ListClickNameCountUseCase {
    constructor(
        @inject("ClickNamesRepository")
        private clickNamesRepository: ClickNamesRepository
    ) {}

    async execute(): Promise<IResponseClickCountDTO[]> {
        const clickCount = await this.clickNamesRepository.find();

        return clickCount;
    }
}

export { ListClickNameCountUseCase };

