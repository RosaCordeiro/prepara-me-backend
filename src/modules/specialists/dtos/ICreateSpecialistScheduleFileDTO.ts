import { SpecialistScheduleFileTypeEnum } from "../enums/SpecialistScheduleFileTypeEnum";

interface Files {
    fileLink?: string;
    fileName: string;
    fileType: SpecialistScheduleFileTypeEnum;
}

interface ICreateSpecialistScheduleFileRequestDTO {
    specialistScheduleId: string;
    id?: string;
    files: Files[];
}

interface ICreateSpecialistScheduleFileDTO {
    fileLink?: string;
    fileName: string;
    fileType: SpecialistScheduleFileTypeEnum;
    specialistScheduleId: string;
    id?: string;
}

export {
    ICreateSpecialistScheduleFileRequestDTO,
    ICreateSpecialistScheduleFileDTO,
};
