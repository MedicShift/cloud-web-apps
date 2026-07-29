import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Department } from '../../departments/entities/department.entity';
import { IsUUID } from 'class-validator';

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
  @IsUUID()
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
