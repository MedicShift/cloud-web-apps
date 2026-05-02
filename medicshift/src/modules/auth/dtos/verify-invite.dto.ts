import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyInviteDto {
  @ApiProperty({ description: 'Invite token received via email' })
  @IsString()
  token!: string;
}
