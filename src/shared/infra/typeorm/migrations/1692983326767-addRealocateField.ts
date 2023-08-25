import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addRealocateField1692983326767 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "companyEmployees",
            new TableColumn({
                name: "realocate",
                type: "boolean",
                isNullable: false,
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
