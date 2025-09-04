import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserWithPassword1757002271517 implements MigrationInterface {
    name = 'UpdateUserWithPassword1757002271517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
