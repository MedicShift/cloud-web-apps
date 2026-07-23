import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'P-001' })
  @IsString()
  mrn!: string;
}
