import { MigrationInterface, QueryRunner } from "typeorm";

export class addnPackageDeclinedCompanyEmployeDefault1715882184657
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "companyEmployees"
            ALTER COLUMN "packageDeclined" 
            SET DEFAULT false; 
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
