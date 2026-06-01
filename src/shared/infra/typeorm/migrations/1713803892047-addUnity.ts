import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addUnity1713803892047 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "unity",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
