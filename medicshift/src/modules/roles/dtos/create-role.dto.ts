import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../auth/enums/permission.enum';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Ward Nurse',
    description: 'Name of the role',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: Permission,
    isArray: true,
    example: [Permission.PATIENTS_READ, Permission.PATIENTS_CREATE],
    description: 'List of permissions assigned to this role',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
