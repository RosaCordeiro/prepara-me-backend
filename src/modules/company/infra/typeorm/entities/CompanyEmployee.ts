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

    /* acolhido */
    @Column()
    accepted: boolean;

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
        accepted: boolean
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        if (!this.accepted) {
            this.accepted = false;
        }

        this.name = name;
        this.subscribeToken = subscribeToken;
        this.companyId = companyId;
        this.documentId = documentId;
        this.userId = userId;
        this.phone = phone;
        this.email = email;
        this.easyRegister = easyRegister;
    }
}

export { CompanyEmployee };

