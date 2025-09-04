import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UpdateUserWithPassword1757002271517 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
