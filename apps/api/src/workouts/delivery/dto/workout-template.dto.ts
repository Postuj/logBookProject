import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  MinLength,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  IsUUID,
} from 'class-validator';
import { ExerciseTemplateDto } from './exercise-template.dto';

export class WorkoutTemplateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdById: string;

  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ minLength: 3, maxLength: 50 })
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ExerciseTemplateDto] })
  exerciseTemplates: ExerciseTemplateDto[];
}

export class CreateWorkoutTemplateDto extends PickType(WorkoutTemplateDto, [
  'name',
] as const) {
  @IsArray()
  @ArrayMaxSize(100)
  @IsUUID(4, { each: true })
  @ApiProperty({ maxItems: 100 })
  exerciseTemplateIds: string[];
}

export class EditWorkoutTemplateDto extends PartialType(
  PickType(WorkoutTemplateDto, ['name'] as const),
) {
  @IsArray()
  @ArrayMaxSize(100)
  @IsUUID(4, { each: true })
  @ApiProperty({ maxItems: 100 })
  exerciseTemplateIds: string[];
}
