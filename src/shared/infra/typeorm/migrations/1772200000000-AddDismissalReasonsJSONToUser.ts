import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDismissalReasonsJSONToUser1772200000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "dismissalReasonsJSON",
            type: "text",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "dismissalReasonsJSON");
    }
}
