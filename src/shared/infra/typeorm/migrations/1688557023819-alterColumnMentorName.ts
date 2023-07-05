import { MigrationInterface, QueryRunner } from "typeorm";

export class alterColumnMentorName1688557023819 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        /* alter name of cokumn */
        await queryRunner.renameColumn("mentoring", "mentor", "mentorId");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

