import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addButtonColor1704999038944 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "material",
            new TableColumn({
                name: "buttonColor",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
