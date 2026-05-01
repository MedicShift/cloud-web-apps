import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';


export class CreateShiftDto {
  @ApiProperty({ example: 'Morning Shift A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '08:00', description: 'Format HH:MM' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '08:00', description: 'Format HH:MM' })
  @IsString()
  endTime: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;
}
