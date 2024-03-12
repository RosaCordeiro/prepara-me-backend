import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { v4 as uuidV4 } from "uuid";

@Entity("users_realocated_logs")
class UserRealocatedLog {
    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    constructor(userId: string, id: string) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        this.userId = userId;
        this.created_at = new Date();
    }
}

export { UserRealocatedLog };
