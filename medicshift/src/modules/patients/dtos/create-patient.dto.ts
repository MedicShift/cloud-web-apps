import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'P-001' })
  @IsString()
  mrn!: string;
}
