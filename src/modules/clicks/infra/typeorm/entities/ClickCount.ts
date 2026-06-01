import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { ClickNames } from "./ClickNames";

@Entity("click_count")
class ClickCount {
    @PrimaryColumn()
    id: string;

    @Column()
    click_name_id: string;

    @ManyToOne(() => ClickNames)
    @JoinColumn({ name: "click_name_id" })
    clickName: ClickNames;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (!this.created_at) {
            this.created_at = new Date();
        }
    }
}

export { ClickCount };

