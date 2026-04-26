import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../enums/schedule-status.enum';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { Department } from '../../departments/entities/department.entity';
import { ScheduleEntry } from './schedule-entry.entity';

@Entity('schedules')
export class Schedule extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ enum: ScheduleStatus })
  @Column({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.DRAFT })
  status: ScheduleStatus;

  @ApiProperty()
  @Column({ type: 'uuid' })
  hospitalId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  departmentId: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(() => ScheduleEntry, (entry) => entry.schedule)
  entries: ScheduleEntry[];
}
