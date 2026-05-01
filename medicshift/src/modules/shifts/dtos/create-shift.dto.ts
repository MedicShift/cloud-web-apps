import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches } from 'class-validator';
import { Optional } from '@nestjs/common';


export class CreateShiftDto {
  @ApiProperty({ example: 'Morning Shift A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '08:00:00', description: 'Format HH:MM:SS' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'startTime must be a valid time in format HH:MM:SS',
  })
  startTime: string;

  @ApiProperty({ example: '16:00:00', description: 'Format HH:MM:SS' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'endTime must be a valid time in format HH:MM:SS',
  })
  endTime: string;

  @ApiProperty({ nullable: true })
  @Optional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty()
  @IsUUID()
  tenantId: string;
}
