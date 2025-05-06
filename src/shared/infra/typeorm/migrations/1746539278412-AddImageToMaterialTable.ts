import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddImageToMaterialTable1746539278412 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("material", new TableColumn({
            name: "image",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("material", "image");
    }

}
