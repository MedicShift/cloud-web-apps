import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Encounter } from '../../encounters/entities/encounter.entity';

@Entity('patients')
export class Patient extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column()
  mrn!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.patient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @OneToMany(() => Encounter, (encounter) => encounter.patient)
  encounters!: Encounter[];
}
