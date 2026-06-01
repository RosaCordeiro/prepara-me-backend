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
import { DismissalTypeEnum } from "@modules/company/enums/DismissalTypeEnum";
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
    user?: User;

    @Column()
    easyRegister: string;

    @Column()
    accepted: boolean;

    @Column()
    realocate: boolean;

    @Column()
    manualCompany: string;

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

    @Column()
    packageDeclined: boolean;

    @Column({ type: "enum", enum: DismissalTypeEnum, nullable: true })
    dismissalType?: DismissalTypeEnum;

    @Column({ nullable: true })
    gender?: string;

    @Column({ nullable: true })
    etnia?: string;

    @Column({ nullable: true })
    pcd?: boolean;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    state?: string;

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
        unity: string,
        packageDeclined: boolean,
        manualCompany: string,
        dismissalType?: DismissalTypeEnum,
        gender?: string,
        etnia?: string,
        pcd?: boolean,
        city?: string,
        state?: string
    ) {
        this.id = id || uuidV4();
        this.accepted = accepted !== undefined ? accepted : false;

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
        this.packageDeclined = packageDeclined;
        this.manualCompany = manualCompany;
        if (dismissalType !== undefined) this.dismissalType = dismissalType;
        if (gender !== undefined) this.gender = gender;
        if (etnia !== undefined) this.etnia = etnia;
        if (pcd !== undefined) this.pcd = pcd;
        if (city !== undefined) this.city = city;
        if (state !== undefined) this.state = state;
    }
}

export { CompanyEmployee };
