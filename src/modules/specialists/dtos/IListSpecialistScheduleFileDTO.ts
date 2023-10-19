import { SpecialistScheduleFileTypeEnum } from "../enums/SpecialistScheduleFileTypeEnum";

export interface IListSpecialistScheduleFileDTO {
    specialistScheduleId: string;
    fileType?: SpecialistScheduleFileTypeEnum;
}

