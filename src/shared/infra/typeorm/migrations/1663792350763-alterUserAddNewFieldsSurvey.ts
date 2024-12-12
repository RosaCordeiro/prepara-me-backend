import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class alterUserAddNewFieldsSurvey1663792350763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "laborRiskJSON",
                type: "varchar",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "brandRiskJSON",
                type: "varchar",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "brandRisk",
                type: "decimal",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "laborRiskJSON")
        await queryRunner.dropColumn("users", "brandRiskJSON")
        await queryRunner.dropColumn("users", "brandRisk")
    }

}
