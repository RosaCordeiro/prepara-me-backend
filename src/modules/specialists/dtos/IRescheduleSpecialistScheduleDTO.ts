import { SpecialistScheduleStatusEnum } from "../enums/SpecialistScheduleStatusEnum";

interface IRescheduleSpecialistScheduleDTO {
    specialistId?: string;
    dateSchedule?: Date;
    status?: SpecialistScheduleStatusEnum;
    userId?: string;
    productId?: string;
    comments?: string;
    hangoutLink?: string;
    scheduleEventId?: string;
    id?: string;
    createEvent?: boolean;
    rating?: number;
    oldScheduleId?: string;
}

export { IRescheduleSpecialistScheduleDTO };
