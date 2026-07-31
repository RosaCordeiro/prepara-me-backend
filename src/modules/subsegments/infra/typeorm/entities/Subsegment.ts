import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Segment } from "@modules/segments/infra/typeorm/entities/Segment";

@Entity("subsegments")
class Subsegment {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    segmentId: string;

    @ManyToOne(() => Segment)
    @JoinColumn({ name: "segmentId" })
    segment: Segment;

    constructor(name?: string, segmentId?: string, id?: string) {
        if (!this.id) {
            this.id = uuidV4();
        }
        if (id) {
            this.id = id;
        }
        if (name !== undefined) {
            this.name = name;
        }
        if (segmentId !== undefined) {
            this.segmentId = segmentId;
        }
    }
}

export { Subsegment };
