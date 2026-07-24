import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ScheduleStatus } from '../enums/schedule-status.enum';

export class UpdateScheduleDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  shiftId?: string;

  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ enum: ScheduleStatus })
  @IsEnum(ScheduleStatus)
  @IsOptional()
  status?: ScheduleStatus;
}
