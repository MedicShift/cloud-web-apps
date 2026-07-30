import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CareLogCategory } from '../enums/care-log-category.enum';
import { CareLogStatus } from '../enums/care-log-status.enum';

export class CreateCareLogDto {
  @ApiProperty()
  @IsUUID()
  handoverEntryId!: string;

  @ApiProperty()
  @IsUUID()
  encounterId!: string;

  @ApiProperty({ enum: CareLogCategory })
  @IsEnum(CareLogCategory)
  category!: CareLogCategory;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ example: '2026-07-28T07:30:00Z', required: false })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ example: '2026-07-28T06:40:00Z', required: false })
  @IsDateString()
  @IsOptional()
  recordedAt?: string;

  @ApiProperty({
    enum: CareLogStatus,
    default: CareLogStatus.PENDING,
    required: false,
  })
  @IsEnum(CareLogStatus)
  @IsOptional()
  status?: CareLogStatus;
}
