"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUsersTable1756975104947 = void 0;
class UpdateUsersTable1756975104947 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying`);
        await queryRunner.query(`UPDATE "users" SET "username" = "name" WHERE "username" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying`);
        await queryRunner.query(`UPDATE "users" SET "fullName" = "name" WHERE "fullName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name")`);
        await queryRunner.query(`UPDATE "users" SET "name" = "username"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }
}
exports.UpdateUsersTable1756975104947 = UpdateUsersTable1756975104947;
//# sourceMappingURL=1756975104947-UpdateUsersTable.js.map