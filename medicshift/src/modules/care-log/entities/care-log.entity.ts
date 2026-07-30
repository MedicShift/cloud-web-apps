import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { HandoverEntry } from '../../handover-entries/entities/handover-entry.entity';
import { Encounter } from '../../encounters/entities/encounter.entity';
import { CareLogCategory } from '../enums/care-log-category.enum';
import { CareLogStatus } from '../enums/care-log-status.enum';

@Entity('care_log')
@Check(`"category" IN ('VITALS','LABS','ORDERS','COMFORT','IV')`)
@Check(`"status" IN ('DONE','PENDING','NEEDS ATTENTION')`)
export class CareLog extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  handoverEntryId!: string;

  @Column({ type: 'uuid' })
  encounterId!: string;

  @Column({ type: 'varchar', length: 20 })
  category!: CareLogCategory;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'timestamp', precision: 0, nullable: true })
  scheduledAt!: Date | null;

  @Column({ type: 'timestamp', precision: 0, nullable: true })
  recordedAt!: Date | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: CareLogStatus.PENDING,
  })
  status!: CareLogStatus;

  @ManyToOne(() => HandoverEntry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'handoverEntryId' })
  handoverEntry!: HandoverEntry;

  @ManyToOne(() => Encounter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encounterId' })
  encounter!: Encounter;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;
}
