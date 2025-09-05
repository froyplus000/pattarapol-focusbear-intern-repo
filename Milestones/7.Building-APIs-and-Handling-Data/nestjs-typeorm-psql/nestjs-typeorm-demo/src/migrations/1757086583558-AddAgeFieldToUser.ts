import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgeFieldToUser1757086583558 implements MigrationInterface {
  name = 'AddAgeFieldToUser1757086583558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "age" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
  }
}
