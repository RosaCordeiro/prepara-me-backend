import { OrderItem } from "@modules/orders/infra/typeorm/entities/OrderItem";
import { ProductBestSellerEnum } from "@modules/products/enums/ProductBestSellerEnum";
import { ProductStatusEnum } from "@modules/products/enums/ProductStatusEnum";
import { ProductTypeEnum } from "@modules/products/enums/ProductTypesEnum";
import { ProductSpecialist } from "@modules/specialists/infra/typeorm/entities/ProductSpecialist";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { ProductContent } from "./ProductContent";
import { SubscriptionPlanProduct } from "./SubscriptionPlanProduct";
import { SpecialistScheduleCancel } from "@modules/specialists/infra/typeorm/entities/SpecialistScheduleCancel";

@Entity("products")
class Product {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    shortName: string;

    @Column()
    slug: string;

    @Column()
    price: number;

    @Column()
    duration: number;

    @Column({
        type: "enum",
        enum: ProductStatusEnum,
        default: ProductStatusEnum.ACTIVE,
    })
    status: ProductStatusEnum;

    @Column({
        type: "enum",
        enum: ProductTypeEnum,
    })
    type: ProductTypeEnum;

    @Column({
        type: "enum",
        enum: ProductBestSellerEnum,
        default: ProductBestSellerEnum.BEST_SELLER,
    })
    bestSeller: ProductBestSellerEnum;

    @Column({
        type: 'boolean',
        default: false,
        name: 'onlyAdmin'
    })
    onlyAdmin: boolean

    @OneToMany(() => ProductContent, (productContent) => productContent.product)
    productContent: ProductContent[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItem: OrderItem[];

    @OneToMany(
        () => ProductSpecialist,
        (productSpecialist) => productSpecialist.product
    )
    public productSpecialist!: ProductSpecialist[];

    @OneToMany(
        () => SubscriptionPlanProduct,
        (subscriptionPlanProduct) => subscriptionPlanProduct.product
    )
    public subscriptionPlanProduct!: SubscriptionPlanProduct[];

    @OneToMany(
        () => SpecialistSchedule,
        (specialistSchedule) => specialistSchedule.specialist
    )
    public specialistSchedule!: SpecialistSchedule[];

    @OneToMany(
        () => SpecialistScheduleCancel,
        (specialistScheduleCancel) => specialistScheduleCancel.id
    )
    specialistScheduleCancel: SpecialistScheduleCancel[];

    constructor(
        name: string,
        shortName: string,
        slug: string,
        price: number,
        duration: number,
        status: ProductStatusEnum,
        type: ProductTypeEnum,
        bestSeller: ProductBestSellerEnum,
        id: string
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        this.name = name;
        this.shortName = shortName;
        this.price = price;
        this.duration = duration;
        this.status = status;
        this.type = type;
        this.bestSeller = bestSeller;
        this.slug = slug;
    }
}

export { Product };
