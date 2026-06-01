import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_questions")
class SurveyQuestion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "companyid" })
    companyId: string;

    @Column({ name: "questiontext" })
    questionText: string;

    @Column({ name: "createdat", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ name: "updatedat", type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}

export { SurveyQuestion };
