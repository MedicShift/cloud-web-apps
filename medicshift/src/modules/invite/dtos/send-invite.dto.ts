import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';

export class SendInviteDto {
    @ApiProperty({ example: 'optimistichermann@proton.me' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: UserRole, default: UserRole.USER, required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

}