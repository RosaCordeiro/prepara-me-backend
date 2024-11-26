import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_questions")
class SurveyQuestion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    companyId: string;

    @Column()
    questionText: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt: Date;
}

export { SurveyQuestion };
