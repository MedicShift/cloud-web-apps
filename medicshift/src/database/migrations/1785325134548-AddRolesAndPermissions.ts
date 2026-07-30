import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRolesAndPermissions1785325134548 implements MigrationInterface {
  name = 'AddRolesAndPermissions1785325134548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover_entries" DROP CONSTRAINT "FK_handover_entries_encounterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" RENAME COLUMN "role" TO "roleId"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."invites_role_enum" RENAME TO "invites_roleid_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "role" TO "roleId"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" RENAME TO "users_roleid_enum"`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "tenantId" uuid, "isCustom" boolean NOT NULL DEFAULT false, "permissions" text NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "roleId"`);
    await queryRunner.query(`ALTER TABLE "invites" ADD "roleId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roleId"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "roleId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "invites" ADD CONSTRAINT "FK_ed2fb45d6edb72be56fd189261f" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover_entries" ADD CONSTRAINT "FK_4e03a49c20d2acdd1af810a6697" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover_entries" DROP CONSTRAINT "FK_4e03a49c20d2acdd1af810a6697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_ed2fb45d6edb72be56fd189261f"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roleId"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "roleId" "public"."users_roleid_enum" NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "roleId"`);
    await queryRunner.query(
      `ALTER TABLE "invites" ADD "roleId" "public"."invites_roleid_enum" NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_roleid_enum" RENAME TO "users_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "roleId" TO "role"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."invites_roleid_enum" RENAME TO "invites_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" RENAME COLUMN "roleId" TO "role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover_entries" ADD CONSTRAINT "FK_handover_entries_encounterId" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
