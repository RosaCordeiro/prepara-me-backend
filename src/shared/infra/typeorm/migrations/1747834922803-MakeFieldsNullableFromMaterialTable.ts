import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class MakeFieldsNullableFromMaterialTable1747834922803 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("material");
        
        const fileColumn = table.findColumnByName("file");
        await queryRunner.changeColumn("material", "file", new TableColumn({
            ...fileColumn,
            isNullable: true
        }));

        const titleColumn = table.findColumnByName("title");
        await queryRunner.changeColumn("material", "title", new TableColumn({
            ...titleColumn,
            isNullable: true
        }));
        
        const slugColumn = table.findColumnByName("slug");
        await queryRunner.changeColumn("material", "slug", new TableColumn({
            ...slugColumn,
            isNullable: true
        }));
        
        const backgroundColorColumn = table.findColumnByName("backgroundColor");
        await queryRunner.changeColumn("material", "backgroundColor", new TableColumn({
            ...backgroundColorColumn,
            isNullable: true
        }));
        
        const buttonColorColumn = table.findColumnByName("buttonColor");
        await queryRunner.changeColumn("material", "buttonColor", new TableColumn({
            ...buttonColorColumn,
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("material");
        
        await queryRunner.query(`
            UPDATE material
            SET file = ''
            WHERE file IS NULL
        `); 

        await queryRunner.query(`
            UPDATE material
            SET title = ''
            WHERE title IS NULL
        `);
        
        await queryRunner.query(`
            UPDATE material
            SET slug = ''
            WHERE slug IS NULL
        `);
        
        await queryRunner.query(`
            UPDATE material
            SET "backgroundColor" = ''
            WHERE "backgroundColor" IS NULL
        `);
        
        await queryRunner.query(`
            UPDATE material
            SET "buttonColor" = ''
            WHERE "buttonColor" IS NULL
        `);
        
        const titleColumn = table.findColumnByName("title");
        await queryRunner.changeColumn("material", "title", new TableColumn({
            ...titleColumn,
            isNullable: false
        }));
        
        const slugColumn = table.findColumnByName("slug");
        await queryRunner.changeColumn("material", "slug", new TableColumn({
            ...slugColumn,
            isNullable: false
        }));
        
        const backgroundColorColumn = table.findColumnByName("backgroundColor");
        await queryRunner.changeColumn("material", "backgroundColor", new TableColumn({
            ...backgroundColorColumn,
            isNullable: false
        }));
        
        const buttonColorColumn = table.findColumnByName("buttonColor");
        await queryRunner.changeColumn("material", "buttonColor", new TableColumn({
            ...buttonColorColumn,
            isNullable: false
        }));
    }

}
