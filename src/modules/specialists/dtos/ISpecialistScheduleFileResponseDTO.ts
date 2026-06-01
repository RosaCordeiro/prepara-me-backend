import { SpecialistScheduleFileTypeEnum } from "../enums/SpecialistScheduleFileTypeEnum";

interface ISpecialistScheduleFileResponseDTO {
    id: string;
    specialistScheduleId: string;
    fileLink: string;
    fileName: string;
    fileType: SpecialistScheduleFileTypeEnum;
    createdAt: Date;
}

export { ISpecialistScheduleFileResponseDTO };
