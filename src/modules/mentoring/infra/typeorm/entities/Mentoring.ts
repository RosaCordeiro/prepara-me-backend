import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Expose } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("mentoring")
class Mentoring {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    date: Date;

    @Column()
    mentor: string;

    @Column()
    linkMeet: string;

    @Column()
    eventId: string;

    @Column()
    vacancies: number;

    @Column()
    users: number;

    @ManyToMany(() => User, (user) => user.mentoring)
    @JoinTable({
        name: "mentoringUsers",
        joinColumns: [{ name: "mentoringId" }],
        inverseJoinColumns: [{ name: "userId" }],
    })
    usersMentoring: User[];

    @Column()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id || this.id === "") {
            this.id = uuidV4();
        }

        if (!this.vacancies) {
            this.vacancies = 250;
        }

        if (!this.users) {
            this.users = 0;
        }

        if (!this.created_at) {
            this.created_at = new Date();
        }
    }
}

export { Mentoring };

