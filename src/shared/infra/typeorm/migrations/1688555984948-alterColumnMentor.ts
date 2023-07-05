import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class alterColumnMentor1688555984948 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("mentoring", "mentor");

        await queryRunner.addColumn(
            "mentoring",
            new TableColumn({
                name: "mentor",
                type: "uuid",
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            "mentoring",
            new TableForeignKey({
                name: "FKMentoringToSpecialists",
                referencedTableName: "specialists",
                referencedColumnNames: ["id"],
                columnNames: ["mentor"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("mentoring", "mentor");
    }
}

