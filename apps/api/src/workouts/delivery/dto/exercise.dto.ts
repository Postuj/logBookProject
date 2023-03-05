import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { CreateSeriesDto, EditSeriesDto, SeriesDto } from './series.dto';

export class ExerciseDto {
  @ApiProperty()
  id: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  templateId?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ minLength: 3, maxLength: 50 })
  name: string;

  @IsBoolean()
  @ApiProperty()
  hasRepetitions: boolean;

  @IsBoolean()
  @ApiProperty()
  hasWeight: boolean;

  @IsBoolean()
  @ApiProperty()
  hasTime: boolean;

  @ApiProperty({ type: [SeriesDto] })
  series: SeriesDto[];
}

export class CreateExerciseDto {
  @IsUUID()
  @ApiProperty()
  templateId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(100)
  @Type(() => CreateSeriesDto)
  @ApiProperty({ type: [CreateSeriesDto] })
  series: CreateSeriesDto[];
}

export class EditExerciseDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  id?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  templateId?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ minLength: 3, maxLength: 50 })
  name: string;

  @IsBoolean()
  @ApiProperty()
  hasRepetitions: boolean;

  @IsBoolean()
  @ApiProperty()
  hasWeight: boolean;

  @IsBoolean()
  @ApiProperty()
  hasTime: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(100)
  @Type(() => EditSeriesDto)
  @ApiProperty({ type: [EditSeriesDto] })
  series: EditSeriesDto[];
}
