import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../auth/enums/permission.enum';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    enum: Permission,
    isArray: true,
    example: [Permission.PATIENTS_READ, Permission.PATIENTS_CREATE],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
