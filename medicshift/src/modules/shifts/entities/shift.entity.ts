import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { Department } from 'src/modules/departments/entities/department.entity';

@Entity('shifts')
export class Shift extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid', nullable: true })
  departmentId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @ManyToOne(() => Department, (department) => department.shifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  department!: Department;
}
