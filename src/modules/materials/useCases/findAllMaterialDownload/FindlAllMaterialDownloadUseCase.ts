import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { IResponseMaterialDownloadDTO } from "@modules/materials/dtos/IResponseMaterialDownloadDTO";
import { MaterialDownloadRepository } from "@modules/materials/infra/typeorm/repository/MaterialDownloadRepository";
import {
    GenerateExcelToolResponse,
    GeradorExcelTools,
} from "@utils/excel/excelConversor";
import { formatDate } from "@utils/formatDate";

import { inject, injectable } from "tsyringe";

@injectable()
class FindAllMaterialDownloadUseCase {
    constructor(
        @inject("MaterialDownloadRepository")
        private materialRepository: MaterialDownloadRepository
    ) {}

    async execute(): Promise<GenerateExcelToolResponse> {
        const materials: any = await this.materialRepository.findAll();
        const geradorExcelTools = new GeradorExcelTools();

        const formatMaterials: IResponseMaterialDownloadDTO[] = materials.map(
            (material) => {
                return {
                    name: material.name,
                    email: material.email,
                    phone: material.phone,
                    company: material.company,
                    position: material.position,
                    created_at: formatDate(
                        material.material_download_created_at
                    ),
                    material_name: material.material_name,
                };
            }
        );

        const headers = [
            "Nome",
            "Email",
            "Telefone",
            "Empresa",
            "Cargo",
            "Data de Criação",
            "Material",
        ];

        return geradorExcelTools.geradorExcel(
            headers,
            formatMaterials,
            "Downloads de Materiais"
        );
    }
}

export { FindAllMaterialDownloadUseCase };
