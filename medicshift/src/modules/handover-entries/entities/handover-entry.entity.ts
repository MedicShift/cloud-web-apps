import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Handover } from 'src/modules/handover/entities/handover.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { Encounter } from 'src/modules/encounters/entities/encounter.entity';

@Entity('handover_entries')
@Unique(['handoverId', 'encounterId'])
export class HandoverEntry extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  handoverId!: string;

  @Column({ type: 'uuid' })
  encounterId!: string;

  @Column()
  situation!: string;

  @Column()
  background!: string;

  @Column()
  assessment!: string;

  @Column()
  recommendation!: string;

  @ManyToOne(() => Handover, (handover) => handover.entries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'handoverId' })
  handover!: Handover;

  @ManyToOne(() => Encounter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encounterId' })
  encounter!: Encounter;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;
}
