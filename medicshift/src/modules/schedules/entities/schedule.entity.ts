import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../enums/schedule-status.enum';
import { Department } from '../../departments/entities/department.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';

@Entity('schedules')
export class Schedule extends BaseEntity {

  @Column()
  userId: string;

  @Column()
  shiftId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'simple-enum', enum: ScheduleStatus, default: ScheduleStatus.DRAFT })
  status: ScheduleStatus;

  @Column({ type: 'uuid' })
  hospitalId: string;  
  
  @Column({ type: 'uuid' })
  departmentId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'departmentId' })
  department: Department;


}
