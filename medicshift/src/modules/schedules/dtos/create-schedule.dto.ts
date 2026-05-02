import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsUUID()
  shiftId!: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  date!: string;
}
