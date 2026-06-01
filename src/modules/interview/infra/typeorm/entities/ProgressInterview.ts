import { User } from "@modules/accounts/infra/typeorm/entities/User";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("progress_interview")
class ProgressInterview {
    @PrimaryColumn()
    id: string;

    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    group: number;

    @Column()
    video: number;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (!this.created_at) {
            this.created_at = new Date();
        }

        if (!this.status) {
            this.status = "pending";
        }

        if (!this.group) {
            this.group = 0;
        }

        if (!this.video) {
            this.video = 0;
        }
    }
}

export { ProgressInterview };
