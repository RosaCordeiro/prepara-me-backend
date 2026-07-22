import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("segments")
class Segment {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    constructor(name?: string, id?: string) {
        if (!this.id) {
            this.id = uuidV4();
        }
        if (id) {
            this.id = id;
        }
        if (name !== undefined) {
            this.name = name;
        }
    }
}

export { Segment };
