import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddAgeFieldToUser1757086583558 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
