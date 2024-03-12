import { v4 as uuidV4 } from "uuid";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";

import { SpecialistSchedule } from "./SpecialistSchedule";
import { SpecialistScheduleFileTypeEnum } from "@modules/specialists/enums/SpecialistScheduleFileTypeEnum";

@Entity("specialistScheduleFiles")
class SpecialistScheduleFiles {
    @PrimaryColumn()
    id: string;

    @Column()
    specialistScheduleId: string;

    @ManyToOne(
        () => SpecialistSchedule,
        (specialist) => specialist.specialistScheduleFiles
    )
    specialistSchedule: SpecialistSchedule;

    @Column()
    fileLink: string;

    @Column()
    fileName: string;

    @Column({
        type: "enum",
        enum: SpecialistScheduleFileTypeEnum,
    })
    fileType: SpecialistScheduleFileTypeEnum;

    @CreateDateColumn()
    createdAt: Date;

    constructor(
        specialistScheduleId: string,
        fileLink: string,
        fileName: string,
        fileType: SpecialistScheduleFileTypeEnum,
        id?: string
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        this.specialistScheduleId = specialistScheduleId;
        this.fileLink = fileLink;
        this.fileName = fileName;
        this.fileType = fileType;
    }
}

export { SpecialistScheduleFiles };
