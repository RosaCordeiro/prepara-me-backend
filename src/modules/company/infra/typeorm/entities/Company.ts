import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { CompanySubscriptionPlan } from "./CompanySubscriptionPlan";
import { Segment } from "@modules/segments/infra/typeorm/entities/Segment";
import { Subsegment } from "@modules/subsegments/infra/typeorm/entities/Subsegment";

@Entity("companies")
class Company {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    segmentId?: string;

    @Column({ nullable: true })
    subsegmentId?: string;

    @ManyToOne(() => Segment, { nullable: true })
    @JoinColumn({ name: "segmentId" })
    segment?: Segment;

    @ManyToOne(() => Subsegment, { nullable: true })
    @JoinColumn({ name: "subsegmentId" })
    subsegment?: Subsegment;

    @OneToMany(
        () => CompanySubscriptionPlan,
        (companySubscriptionPlan) => companySubscriptionPlan.company
    )
    public companySubscriptionPlan!: CompanySubscriptionPlan[];

    constructor(
        name: string,
        id?: string,
        segmentId?: string,
        subsegmentId?: string
    ) {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (id) {
            this.id = id;
        }

        this.name = name;
        this.segmentId = segmentId;
        this.subsegmentId = subsegmentId;
    }
}

export { Company };
