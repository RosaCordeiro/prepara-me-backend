import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddDismissalTypeToCompanyEmployee1771894464000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("companyEmployees", new TableColumn({
            name: "dismissalType",
            type: "enum",
            enum: ["voluntary", "involuntary"],
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("companyEmployees", "dismissalType");
    }
}