import { User } from "@modules/accounts/infra/typeorm/entities/User";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Company } from "./Company";

@Entity("companyEmployees")
class CompanyEmployee {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    subscribeToken: string;

    @Column()
    documentId: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    companyId: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: "companyId" })
    company: Company;

    @Column()
    userId: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    easyRegister: string;

    @Column()
    accepted: boolean;

    @Column()
    realocate: boolean;

    @Column()
    entryDate: Date;

    @Column()
    position: string;

    @Column()
    department: string;

    @Column()
    plan: string;

    @Column()
    unity: string;

    constructor(
        name: string,
        subscribeToken: string,
        companyId: string,
        documentId: string,
        phone: string,
        email: string,
        userId: string,
        id: string,
        easyRegister: string,
        accepted: boolean,
        realocate: boolean,
        entryDate: Date,
        position: string,
        department: string,
        plan: string,
        unity: string
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        if (!this.accepted) {
            this.accepted = false;
        } else {
            this.accepted = accepted;
        }

        this.name = name;
        this.subscribeToken = subscribeToken;
        this.companyId = companyId;
        this.documentId = documentId;
        this.userId = userId;
        this.phone = phone;
        this.email = email;
        this.easyRegister = easyRegister;
        this.realocate = realocate;
        this.entryDate = entryDate;
        this.position = position;
        this.department = department;
        this.plan = plan;
        this.unity = unity;
    }
}

export { CompanyEmployee };
