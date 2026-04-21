import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ShiftType } from '../enums/shift-type.enum';
import { Hospital } from '../../hospitals/entities/hospital.entity';

@Entity('shifts')
export class Shift extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ description: 'Start time in format HH:MM:SS' })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({ description: 'End time in format HH:MM:SS' })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({ enum: ShiftType })
  @Column({ type: 'enum', enum: ShiftType })
  shiftType: ShiftType;

  @ApiProperty()
  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;
}
