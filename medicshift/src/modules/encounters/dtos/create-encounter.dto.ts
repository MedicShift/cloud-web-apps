import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EncounterType } from '../enums/encounters.encounterType';
import { EncounterStatus } from '../enums/encounters.status';

export class CreateEncounterDto {
  @ApiProperty()
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsUUID()
  departmentId!: string;

  @ApiProperty({ enum: EncounterType })
  @IsEnum(EncounterType)
  encounterType!: EncounterType;

  @ApiProperty({ example: 'B-204' })
  @IsString()
  bedNumber!: string;

  @ApiProperty({
    enum: EncounterStatus,
    default: EncounterStatus.ADMITTED,
    required: false,
  })
  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @ApiProperty({ example: '2026-07-22T09:00:00Z' })
  @IsDateString()
  admittedAt!: string;

  @ApiProperty({ example: '2026-07-24T09:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  dischargedAt?: string;
}
