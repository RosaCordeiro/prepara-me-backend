import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSurveyQuestions1732637157532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE survey_questions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                companyId VARCHAR NOT NULL,
                questionText TEXT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updatedAt_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updatedAt = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER update_survey_questions_updatedAt
            BEFORE UPDATE ON survey_questions
            FOR EACH ROW
            EXECUTE FUNCTION update_updatedAt_column();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS update_survey_questions_updatedAt ON survey_questions;
        `);

        await queryRunner.query(`
            DROP FUNCTION IF EXISTS update_updatedAt_column;
        `);

        await queryRunner.query(`
            DROP TABLE IF EXISTS survey_questions;
        `);
    }

}
