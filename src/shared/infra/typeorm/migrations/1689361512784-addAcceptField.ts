import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addAcceptField1689361512784 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "companyEmployees",
            new TableColumn({
                name: "accepted",
                type: "boolean",
                isNullable: false,
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

