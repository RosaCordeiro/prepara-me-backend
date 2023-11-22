import { ICreateMaterialDownloadDTO } from "@modules/materials/dtos/ICreateMaterialDownloadDTO";
import { MaterialDownload } from "@modules/materials/infra/typeorm/entities/MaterialDownload";
import { MaterialDownloadRepository } from "@modules/materials/infra/typeorm/repository/MaterialDownloadRepository";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";

import { AppError } from "@shared/errors/AppError";
import { isUUID } from "@utils/isUUID";

import { inject, injectable } from "tsyringe";

@injectable()
class CreateMaterialDownloadUseCase {
    constructor(
        @inject("MaterialDownloadRepository")
        private materialDownloadRepository: MaterialDownloadRepository,
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(
        content: ICreateMaterialDownloadDTO
    ): Promise<MaterialDownload> {
        this.validInput(content);

        return await this.materialDownloadRepository.create(content);
    }

    validInput(content: ICreateMaterialDownloadDTO): void {
        if (
            content.name === "" ||
            content.name === undefined ||
            content.name === null
        ) {
            throw new AppError("Name is required");
        }

        if (
            content.email === "" ||
            content.email === undefined ||
            content.email === null
        ) {
            throw new AppError("Email is required");
        }

        if (
            content.phone === "" ||
            content.phone === undefined ||
            content.phone === null
        ) {
            throw new AppError("Phone is required");
        }

        console.log(content.material_id);

        if (
            content.material_id === "" ||
            content.material_id === undefined ||
            content.material_id === null
        ) {
            throw new AppError("Material is required");
        } else {
            if (isUUID(content.material_id)) {
                const material = this.materialRepository.findById(
                    content.material_id
                );

                if (!material) {
                    throw new AppError("Material not found");
                }
            } else {
                throw new AppError("Material not found");
            }
        }
    }
}

export { CreateMaterialDownloadUseCase };
