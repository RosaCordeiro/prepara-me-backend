import { v4 as uuidV4 } from "uuid";

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { Specialist } from "./Specialist";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { SpecialistScheduleCancelReasonEnum } from "@modules/specialists/enums/SpecialistScheduleCancelReasonEnum";

@Entity("specialistScheduleCancel")
class SpecialistScheduleCancel {
    @PrimaryColumn()
    id: string;

    @Column()
    dateSchedule: Date;

    @Column()
    specialistId: string;
    @ManyToOne(
        () => Specialist,
        (specialist) => specialist.specialistScheduleCancel
    )
    specialist: Specialist;

    @Column()
    userId: string;
    @ManyToOne(() => User, (user) => user.specialistScheduleCancel)
    user: User;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (product) => product.specialistScheduleCancel)
    product: Product;

    @Column({
        type: "enum",
        enum: SpecialistScheduleCancelReasonEnum,
        default: SpecialistScheduleCancelReasonEnum.CANCELED,
    })
    reason: SpecialistScheduleCancelReasonEnum;

    @CreateDateColumn()
    created_at: Date;

    constructor(
        dateSchedule: Date,
        specialistId: string,
        userId: string,
        productId: string,
        id: string,
        reason: SpecialistScheduleCancelReasonEnum
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        this.dateSchedule = dateSchedule;
        this.specialistId = specialistId;
        this.userId = userId;
        this.productId = productId;
        this.reason = reason;
    }
}

export { SpecialistScheduleCancel };
