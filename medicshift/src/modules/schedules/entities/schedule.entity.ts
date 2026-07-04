import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ScheduleStatus } from '../enums/schedule-status.enum';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { IsUUID } from 'class-validator';
import { User } from '../../users/entities/user.entity';

import { Shift } from '../../shifts/entities/shift.entity';

@Entity('schedules')
export class Schedule extends BaseEntity {
  @Column({ type: 'uuid' })
  @IsUUID()
  userId!: string;

  @Column({ type: 'uuid' })
  @IsUUID()
  shiftId!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({
    type: 'simple-enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.DRAFT,
  })
  status!: ScheduleStatus;

  @Column({ type: 'uuid' })
  @IsUUID()
  tenantId!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Shift, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shiftId' })
  shift!: Shift;
}
