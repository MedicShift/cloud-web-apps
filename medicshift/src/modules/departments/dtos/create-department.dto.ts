import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Emergency Room' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  departmentHeadId?: string;
}
