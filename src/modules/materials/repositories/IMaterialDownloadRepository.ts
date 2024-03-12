import { ICreateMaterialDownloadDTO } from "../dtos/ICreateMaterialDownloadDTO";
import { IResponseMaterialDownloadDTO } from "../dtos/IResponseMaterialDownloadDTO";
import { MaterialDownload } from "../infra/typeorm/entities/MaterialDownload";

interface IMaterialDownloadRepository {
    create(data: ICreateMaterialDownloadDTO): Promise<MaterialDownload>;
    findAll(): Promise<MaterialDownload[]>;
}

export { IMaterialDownloadRepository };
