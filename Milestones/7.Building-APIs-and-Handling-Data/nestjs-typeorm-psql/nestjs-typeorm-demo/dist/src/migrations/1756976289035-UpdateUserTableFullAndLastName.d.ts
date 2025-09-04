import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UpdateUserTableFullAndLastName1756976289035 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
