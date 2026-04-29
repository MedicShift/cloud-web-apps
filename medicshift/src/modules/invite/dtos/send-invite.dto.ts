import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';

export class SendInviteDto {
    @ApiProperty({ example: 'optimistichermann@proton.me' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    @IsString()
    tenantId: string;

    @ApiProperty({ enum: UserRole, default: UserRole.USER, required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

}