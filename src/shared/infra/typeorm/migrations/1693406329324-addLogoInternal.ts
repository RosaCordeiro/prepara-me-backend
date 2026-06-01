import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addLogoInternal1693406329324 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "companyPage",
            new TableColumn({
                name: "logoInternal",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
