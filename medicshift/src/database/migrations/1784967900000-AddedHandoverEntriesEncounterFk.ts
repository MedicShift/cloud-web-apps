import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedHandoverEntriesEncounterFk1784967900000 implements MigrationInterface {
  name = 'AddedHandoverEntriesEncounterFk1784967900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover_entries" ADD CONSTRAINT "FK_handover_entries_encounterId" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover_entries" DROP CONSTRAINT "FK_handover_entries_encounterId"`,
    );
  }
}
