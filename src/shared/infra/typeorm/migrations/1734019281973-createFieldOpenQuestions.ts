import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class createFieldOpenQuestions1734019281973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "surveyQuestion",
                type: "varchar",
                isNullable: true,
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "surveyQuestion")
    }

}
