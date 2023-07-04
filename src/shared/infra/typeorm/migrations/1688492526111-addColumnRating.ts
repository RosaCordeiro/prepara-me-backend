import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addColumnRating1688492526111 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "mentoringUsers",
            new TableColumn({
                name: "rating",
                type: "numeric",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

