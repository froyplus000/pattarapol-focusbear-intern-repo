import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTable1756975104947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add username column as nullable
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying`,
    );

    // Copy data from name to username for existing records
    await queryRunner.query(
      `UPDATE "users" SET "username" = "name" WHERE "username" IS NULL`,
    );

    // Now make username NOT NULL and add unique constraint
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );

    // Add fullName column as nullable initially
    await queryRunner.query(
      `ALTER TABLE "users" ADD "fullName" character varying`,
    );

    // Copy data from name to fullName for existing records
    await queryRunner.query(
      `UPDATE "users" SET "fullName" = "name" WHERE "fullName" IS NULL`,
    );

    // Make fullName NOT NULL
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "fullName" SET NOT NULL`,
    );

    // Drop the old name column and its constraint
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the name column
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name")`,
    );

    // Copy data back from username to name
    await queryRunner.query(`UPDATE "users" SET "name" = "username"`);

    // Drop the new columns
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
