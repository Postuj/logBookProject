import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class ExerciseTemplateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdById: string;

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
}

export class CreateExerciseTemplateDto extends OmitType(ExerciseTemplateDto, [
  'createdById',
  'id',
] as const) {}

export class EditExerciseTemplateDto extends PartialType(
  OmitType(ExerciseTemplateDto, ['createdById', 'id'] as const),
) {}
