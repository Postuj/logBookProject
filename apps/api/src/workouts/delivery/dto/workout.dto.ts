import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  MinLength,
  MaxLength,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import {
  CreateExerciseDto,
  EditExerciseDto,
  ExerciseDto,
} from './exercise.dto';

export class WorkoutDto {
  @ApiProperty()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ minLength: 3, maxLength: 50 })
  name: string;

  @ApiProperty()
  createdById: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  templateId?: string;

  @ApiPropertyOptional()
  finishedAt?: Date;

  @ApiProperty({ type: [ExerciseDto] })
  exercises: ExerciseDto[];
}

export class CreateWorkoutDto extends OmitType(WorkoutDto, [
  'id',
  'createdById',
  'exercises',
  'finishedAt',
] as const) {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(100)
  @Type(() => CreateExerciseDto)
  @ApiProperty({ type: [CreateExerciseDto] })
  exercises: CreateExerciseDto[];
}

export class EditWorkoutDto extends OmitType(WorkoutDto, [
  'id',
  'createdById',
  'exercises',
  'finishedAt',
  'templateId',
] as const) {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(100)
  @Type(() => EditExerciseDto)
  @ApiProperty({ type: [EditExerciseDto] })
  exercises: EditExerciseDto[];
}
