import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { Product } from "./Product";
import { SubscriptionPlan } from "./SubscriptionPlan";

@Entity("subscriptionPlanProducts")
class SubscriptionPlanProduct {
    @PrimaryColumn()
    id: string;

    @ManyToOne(
        () => SubscriptionPlan,
        (subscriptionPlan) => subscriptionPlan.subscriptionPlanProduct
    )
    subscriptionPlan: SubscriptionPlan;

    @ManyToOne(() => Product, (product) => product.subscriptionPlanProduct)
    product: Product;

    @Column()
    subscriptionPlanId: string;

    @Column()
    productId: string;

    @Column()
    availableQuantity: number;

    constructor(
        subscriptionPlanId: string,
        productId: string,
        availableQuantity: number,
        id?: string
    ) {
        if (!this.id) {
            this.id = uuidV4();
        }

        if (id) {
            this.id = id;
        }

        this.subscriptionPlanId = subscriptionPlanId;
        this.productId = productId;
        this.availableQuantity = availableQuantity;
    }
}

export { SubscriptionPlanProduct };
