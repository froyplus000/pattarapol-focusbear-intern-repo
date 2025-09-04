"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserWithPassword1757002271517 = void 0;
class UpdateUserWithPassword1757002271517 {
    name = 'UpdateUserWithPassword1757002271517';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }
}
exports.UpdateUserWithPassword1757002271517 = UpdateUserWithPassword1757002271517;
//# sourceMappingURL=1757002271517-UpdateUserWithPassword.js.map