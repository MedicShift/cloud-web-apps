import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';

@Entity('shifts')
export class Shift extends BaseEntity {

  @Column()
  name: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
  
  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  tenant: Tenant;

}
