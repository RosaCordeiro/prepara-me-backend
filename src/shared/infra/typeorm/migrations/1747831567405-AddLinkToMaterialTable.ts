import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLinkToMaterialTable1747831567405 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("material", new TableColumn({
            name: "link",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("material", "link");
    }

}
