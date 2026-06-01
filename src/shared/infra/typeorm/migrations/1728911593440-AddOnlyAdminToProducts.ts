import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddOnlyAdminToProducts1728911593440 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('products');
        if (!table) {
            throw new Error('Table "products" does not exist');
        }

        if (!table.findColumnByName('onlyAdmin')) {
            await queryRunner.addColumn('products', new TableColumn({
                name: 'onlyAdmin',
                type: 'boolean',
                isNullable: false,
                default: false,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('products');
        if (!table) return;

        const columnExists = table.findColumnByName('onlyAdmin');
        if (columnExists) {
            await queryRunner.dropColumn('products', 'onlyAdmin');
        }
    }

}
