import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { HandoverStatus } from '../enums/handover-status.enum';
import { HandoverEntryItemDto } from '../../handover-entries/dtos/handover-entry-item.dto';

export class UpsertHandoverDto {
  @ApiProperty()
  @IsUUID()
  scheduleId!: string;

  @ApiProperty()
  @IsUUID()
  authorId!: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  recipientId!: string;

  @ApiProperty({
    enum: HandoverStatus,
    default: HandoverStatus.DRAFT,
    required: false,
  })
  @IsEnum(HandoverStatus)
  @IsOptional()
  status?: HandoverStatus;

  @ApiProperty({ example: '2026-07-22T09:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  submittedAt?: string;

  @ApiProperty({ type: [HandoverEntryItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HandoverEntryItemDto)
  entries!: HandoverEntryItemDto[];
}
