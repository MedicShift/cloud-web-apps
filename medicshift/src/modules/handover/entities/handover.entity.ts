import { Column, Entity, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { HandoverEntry } from '../../handover-entries/entities/handover-entry.entity';
import { HandoverStatus } from '../enums/handover-status.enum';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('handover')
export class Handover extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  scheduleId!: string;

  @Column({ type: 'uuid' })
  authorId!: string;

  @Column({ type: 'uuid', nullable: true })
  recipientId?: string | null;

  @Column({
    type: 'simple-enum',
    enum: HandoverStatus,
    default: HandoverStatus.DRAFT,
  })
  status!: HandoverStatus;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt!: Date | null;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @OneToOne(() => Schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule!: Schedule;

  @OneToMany(() => HandoverEntry, (entry) => entry.handover)
  entries!: HandoverEntry[];
}
