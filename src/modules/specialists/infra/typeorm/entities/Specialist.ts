import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { ProductSpecialist } from "./ProductSpecialist";
import { SpecialistSchedule } from "./SpecialistSchedule";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";

@Entity("specialists")
class Specialist {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    bio: string;

    @Column({
        type: "enum",
        enum: SpecialistStatusEnum,
        default: SpecialistStatusEnum.ACTIVE,
    })
    status: SpecialistStatusEnum;

    @Column()
    userId: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    linkedinUrl: string;

    @OneToMany(
        () => ProductSpecialist,
        (productSpecialist) => productSpecialist.specialist
    )
    public productSpecialist!: ProductSpecialist[];

    @OneToMany(
        () => SpecialistSchedule,
        (specialistSchedule) => specialistSchedule.specialist
    )
    specialistSchedule: SpecialistSchedule[];

    @OneToMany(() => Mentoring, (m) => m.mentor)
    mentoring: Mentoring[];

    constructor(
        name: string,
        bio: string,
        status: SpecialistStatusEnum,
        userId: string,
        linkedinUrl: string,
        id: string
    ) {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (id) {
            this.id = id;
        }

        this.name = name;
        this.bio = bio;
        this.status = status;
        this.userId = userId;
        this.linkedinUrl = linkedinUrl;
    }
}

export { Specialist };

