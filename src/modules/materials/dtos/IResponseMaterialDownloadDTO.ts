interface IResponseMaterialDownloadDTO {
    name: string;
    email: string;
    phone: string;
    company?: string;
    position?: string;
    created_at: Date;
    material_name: string;
}

export { IResponseMaterialDownloadDTO };
