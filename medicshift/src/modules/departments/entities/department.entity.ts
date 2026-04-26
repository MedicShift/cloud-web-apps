import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Hospital } from '../../hospitals/entities/hospital.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;
}
