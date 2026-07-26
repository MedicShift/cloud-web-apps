import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class HandoverEntryItemDto {
  @ApiProperty()
  @IsUUID()
  encounterId!: string;

  @ApiProperty()
  @IsString()
  situation!: string;

  @ApiProperty()
  @IsString()
  background!: string;

  @ApiProperty()
  @IsString()
  assessment!: string;

  @ApiProperty()
  @IsString()
  recommendation!: string;
}
