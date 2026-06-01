import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addActive1692977926295 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "companyPage",
            new TableColumn({
                name: "active",
                type: "boolean",
                isNullable: false,
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
