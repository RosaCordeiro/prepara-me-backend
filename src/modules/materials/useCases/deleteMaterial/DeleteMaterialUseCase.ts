import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class DeleteMaterialUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute(id: string): Promise<void> {
        const material = await this.materialRepository.findById(id);

        await this.materialRepository.delete(material.id);
        await this.storageProvider.delete(material.file, "material");
    }
}

export { DeleteMaterialUseCase };
