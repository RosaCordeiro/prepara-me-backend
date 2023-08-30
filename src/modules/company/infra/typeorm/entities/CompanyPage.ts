import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Company } from "./Company";

@Entity("companyPage")
class CompanyPage {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    vacancies: number;

    @Column()
    expirationDate: Date;

    @Column()
    logo: string;

    @Column()
    logoInternal: string;

    @Column()
    text?: string;

    @Column()
    backgroundColor?: string;

    @Column()
    containerColor?: string;

    @Column()
    clockColor?: string;

    @Column()
    textColor?: string;

    @Column()
    companyId: string;

    @OneToOne(() => Company)
    @JoinColumn({ name: "companyId" })
    company: Company;

    @Column()
    active: boolean;

    constructor(
        id: string,
        name: string,
        vacancies: number,
        expirationDate: Date,
        logo: string,
        logoInternal: string,
        text: string,
        backgroundColor: string,
        containerColor: string,
        clockColor: string,
        textColor: string,
        companyId: string,
        active: boolean
    ) {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (id) {
            this.id = id;
        }

        this.name = name;
        this.vacancies = vacancies;
        this.expirationDate = expirationDate;
        this.logo = logo;
        this.logoInternal = logoInternal;
        this.text = text;
        this.backgroundColor = backgroundColor;
        this.containerColor = containerColor;
        this.clockColor = clockColor;
        this.textColor = textColor;
        this.companyId = companyId;
        this.active = active;
    }
}

export { CompanyPage };
