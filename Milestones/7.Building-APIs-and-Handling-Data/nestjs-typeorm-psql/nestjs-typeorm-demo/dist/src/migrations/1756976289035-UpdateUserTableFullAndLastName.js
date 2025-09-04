"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserTableFullAndLastName1756976289035 = void 0;
class UpdateUserTableFullAndLastName1756976289035 {
    name = 'UpdateUserTableFullAndLastName1756976289035';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying NOT NULL`);
    }
}
exports.UpdateUserTableFullAndLastName1756976289035 = UpdateUserTableFullAndLastName1756976289035;
//# sourceMappingURL=1756976289035-UpdateUserTableFullAndLastName.js.map