import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SeriesDto {
  @ApiProperty()
  id: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  repetitions?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  weight?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  seconds?: number;
}

export class CreateSeriesDto extends OmitType(SeriesDto, ['id'] as const) {}

export class EditSeriesDto extends OmitType(SeriesDto, ['id'] as const) {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  id?: string;
}
