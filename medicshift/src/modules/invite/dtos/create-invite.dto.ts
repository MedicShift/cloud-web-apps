import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { InviteStatus } from '../enums/invite-status';

export class CreateInviteDto {
  @ApiProperty()
  @IsUUID()
  tenantId!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsUUID()
  invitedBy!: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiProperty({ enum: InviteStatus })
  @IsEnum(InviteStatus)
  status?: InviteStatus;

  @ApiProperty({ example: '2026-05-31' })
  @IsDateString()
  expiresAt!: string;

  @ApiProperty({ example: '2026-05-31', required: false })
  @IsOptional()
  @IsDateString()
  acceptedAt?: string;
}
