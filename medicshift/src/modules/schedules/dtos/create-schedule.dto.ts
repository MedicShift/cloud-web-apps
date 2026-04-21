import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsUUID()
  hospitalId: string;

  @ApiProperty()
  @IsUUID()
  departmentId: string;
}
