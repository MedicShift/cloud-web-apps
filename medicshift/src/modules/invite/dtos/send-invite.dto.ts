import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class SendInviteDto {
  @ApiProperty({ example: 'optimistichermann@proton.me' })
  @IsEmail()
  email!: string;

  @ApiProperty({ required: true })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
