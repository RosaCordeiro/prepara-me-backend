import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { UserStatusEnum } from "@modules/accounts/enums/UserStatusEnum";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { Company } from "@modules/company/infra/typeorm/entities/Company";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";
import { Order } from "@modules/orders/infra/typeorm/entities/Order";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { SpecialistScheduleCancel } from "@modules/specialists/infra/typeorm/entities/SpecialistScheduleCancel";
import { SpecialistScheduleFiles } from "@modules/specialists/infra/typeorm/entities/SpecialistScheduleFiles";
import { ColumnNumericTransformer } from "@utils/ColumnNumericTransformer";
import { Expose } from "class-transformer";
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("users")
class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    documentId: string;

    @Column()
    subscribeToken: string;

    @Column({
        type: "enum",
        enum: UserTypeEnum,
        default: UserTypeEnum.USER,
    })
    type: UserTypeEnum;

    @Column({
        type: "enum",
        enum: UserStatusEnum,
        default: UserStatusEnum.ACTIVE,
    })
    status: UserStatusEnum;

    @Column({
        type: "enum",
        enum: UserLaborRiskAlertEnum,
        default: UserLaborRiskAlertEnum.NORMAL,
    })
    laborRiskAlert: UserLaborRiskAlertEnum;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(
        () => SpecialistSchedule,
        (specialistSchedule) => specialistSchedule.id
    )
    specialistSchedule: SpecialistSchedule[];

    @OneToMany(
        () => SpecialistScheduleCancel,
        (specialistScheduleCancel) => specialistScheduleCancel.id
    )
    specialistScheduleCancel: SpecialistScheduleCancel[];

    @OneToMany(() => Order, (order) => order.id)
    order: Order[];

    @ManyToOne(() => Company, (company) => company.id)
    company: Company;

    @Column()
    companyId: string;

    @Expose({ name: "avatarUrl" })
    avatarUrl(): string {
        switch (process.env.disk) {
            case "local":
                if (!this.avatar) {
                    return `${process.env.APP_API_URL_PLATFORM}/avatar/nopic.png`;
                } else {
                    return `${process.env.APP_API_URL_PLATFORM}/avatar/${this.avatar}`;
                }
            case "s3":
                if (!this.avatar) {
                    return `${process.env.AWS_BUCKET_URL}/avatar/nopic.png`;
                } else {
                    return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
                }
            default:
                return null;
        }
    }

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    laborRisk: number;

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    NPSSurvey: number;

    @Column()
    surveyAnswered: boolean;

    @Column({
        type: "enum",
        enum: UserRealocatedEnum,
        default: UserRealocatedEnum.NOT_REALOCATED,
    })
    realocated: UserRealocatedEnum;

    @Column()
    feelingsMapJSON: string;

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
    brandRisk: number;

    @Column()
    laborRiskJSON: string;

    @Column()
    brandRiskJSON: string;

    @Column({ nullable: true })
    dismissalReasonsJSON: string;

    @Column()
    surveyQuestion: string;

    @Column()
    expiresDate: Date;

    @Column()
    periodTest: Date;

    @ManyToMany(() => Mentoring, (mentoring) => mentoring.usersMentoring)
    mentoring: Mentoring[];

    @Column()
    companyNameSignIn: string;

    constructor(
        name: string,
        username: string,
        email: string,
        password: string,
        documentId: string,
        type: UserTypeEnum,
        status: UserStatusEnum,
        id: string,
        laborRisk: number,
        NPSSurvey: number,
        surveyAnswered: boolean,
        companyId: string,
        realocated: UserRealocatedEnum,
        feelingsMapJSON: string,
        brandRisk: number,
        laborRiskJSON: string,
        surveyQuestion: string,
        brandRiskJSON: string,
        laborRiskAlert: UserLaborRiskAlertEnum,
        expiresDate: Date,
        periodTest: Date,
        subscribeToken: string,
        companyNameSignIn: string,
        dismissalReasonsJSON?: string
    ) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        if (password) {
            this.password = password;
        }

        this.name = name;
        this.username = username;
        this.email = email;
        this.documentId = documentId;
        this.type = type;
        this.status = status;
        this.laborRisk = laborRisk;
        this.NPSSurvey = NPSSurvey;
        this.surveyAnswered = surveyAnswered;
        this.companyId = companyId;
        this.realocated = realocated;
        this.feelingsMapJSON = feelingsMapJSON;
        this.brandRisk = brandRisk;
        this.laborRiskJSON = laborRiskJSON;
        this.surveyQuestion = surveyQuestion;
        this.brandRiskJSON = brandRiskJSON;
        this.laborRiskAlert = laborRiskAlert;
        if (dismissalReasonsJSON !== undefined) this.dismissalReasonsJSON = dismissalReasonsJSON;
        this.expiresDate = expiresDate;
        this.periodTest = periodTest;
        this.subscribeToken = subscribeToken;
        this.companyNameSignIn = companyNameSignIn;
    }
}

export { User };
