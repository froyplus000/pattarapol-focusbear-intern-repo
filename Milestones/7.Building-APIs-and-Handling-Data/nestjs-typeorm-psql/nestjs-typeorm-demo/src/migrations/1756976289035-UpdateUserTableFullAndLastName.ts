import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTableFullAndLastName1756976289035
  implements MigrationInterface
{
  name = 'UpdateUserTableFullAndLastName1756976289035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastName" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "fullName" character varying NOT NULL`,
    );
  }
}
