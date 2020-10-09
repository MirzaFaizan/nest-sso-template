import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthTable1599884986192 implements MigrationInterface {
  name = 'AuthTable1599884986192';

  tableName = 'auth';

  emailIndex = 'IDX_e752eb2b26ab264e32b8dff5eb';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "email" character varying NOT NULL,
        "provider" character varying NOT NULL,
        "password" character varying,
        "linkedinID" character varying,
        "googleID" character varying,
        "email_verified" boolean NOT NULL DEFAULT false,
        "email_verification_token" character varying,
        "reset_password_token" character varying,
        CONSTRAINT "UQ_e752eb2b26ab264e32b8dff5eb9"
        UNIQUE ("email", "provider"),
        CONSTRAINT "PK_8bc3f601d024f5de30c19bc4da8"
        PRIMARY KEY ("id", "email")
      )
    `);
    await queryRunner.query(`CREATE INDEX "${this.emailIndex}" ON "${this.tableName}" ("email", "provider") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "${this.emailIndex}"`);
    await queryRunner.query(`DROP TABLE "${this.tableName}"`);
  }
}
