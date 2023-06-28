import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { CompanySubscriptionPlan } from "./CompanySubscriptionPlan";

@Entity("companies")
class Company {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(
        () => CompanySubscriptionPlan,
        (companySubscriptionPlan) => companySubscriptionPlan.company
    )
    public companySubscriptionPlan!: CompanySubscriptionPlan[];

    constructor(name: string, id: string) {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (id) {
            this.id = id;
        }

        this.name = name;
    }
}

export { Company };

