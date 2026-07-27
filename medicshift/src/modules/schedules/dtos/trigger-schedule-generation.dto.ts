import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateTriggerScheduleDto {
  @ApiProperty()
  @IsUUID()
  departmentId: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  endDate: string;
}
