import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addSlugProduct1696421358571 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "products",
            new TableColumn({
                name: "slug",
                type: "varchar",
                isUnique: true,
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
