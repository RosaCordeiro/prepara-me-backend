import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class alterSpecialist1690200660937 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "specialists",
            new TableColumn({
                name: "image",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

