import { MigrationInterface, QueryRunner } from "typeorm";

export class myInit1668101881253 implements MigrationInterface {
    name = 'myInit1668101881253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "userId" TO "userLogin"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "userLogin"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "userLogin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "userLogin"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "userLogin" integer`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "userLogin" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
