import { Product } from "@modules/products/infra/typeorm/entities/Product";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { v4 as uuidV4 } from "uuid";
import { UserProductAvailable } from "./UserProductAvailable";

@Entity("userProductsAvailableLog")
class UserProductAvailableLog {
    @PrimaryColumn()
    id: string;

    @Column()
    userProductsAvailableId: string;

    @OneToOne(() => UserProductAvailable)
    @JoinColumn({ name: "userProductsAvailableId" })
    userProductsAvailable: UserProductAvailable;

    @Column()
    userId: string;

    @Column()
    productIdNew: string;

    @Column()
    productIdOld: string;

    @Column()
    availableQuantity: number;

    @CreateDateColumn()
    created_at: Date;

    constructor(
        id: string,
        userProductsAvailableId: string,
        userId: string,
        productIdNew: string,
        productIdOld: string,
        availableQuantity: number
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        this.userId = userId;
        this.userProductsAvailableId = userProductsAvailableId;
        this.productIdNew = productIdNew;
        this.productIdOld = productIdOld;
        this.availableQuantity = availableQuantity;
    }
}

export { UserProductAvailableLog };
