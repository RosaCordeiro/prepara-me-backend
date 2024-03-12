import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class FindAllMaterialUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(): Promise<IResponseMaterialDTO[]> {
        return await this.materialRepository.findAll();
    }
}

export { FindAllMaterialUseCase };
