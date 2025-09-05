"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAgeFieldToUser1757086583558 = void 0;
class AddAgeFieldToUser1757086583558 {
    name = 'AddAgeFieldToUser1757086583558';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "age" integer`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
    }
}
exports.AddAgeFieldToUser1757086583558 = AddAgeFieldToUser1757086583558;
//# sourceMappingURL=1757086583558-AddAgeFieldToUser.js.map