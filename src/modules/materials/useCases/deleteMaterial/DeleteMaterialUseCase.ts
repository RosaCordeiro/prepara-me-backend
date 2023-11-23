import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class DeleteMaterialUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(id: string): Promise<void> {
        await this.materialRepository.delete(id);
    }
}

export { DeleteMaterialUseCase };
