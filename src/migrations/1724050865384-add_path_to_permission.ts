import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class Migrations1724050865384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'permissions',
      new TableColumn({
        name: 'path_api',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('permissions', 'path_api');
  }
}
