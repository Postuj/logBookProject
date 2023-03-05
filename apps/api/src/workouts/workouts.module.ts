import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ExerciseTemplatesController } from './delivery/controllers/exercise-templates/exercise-templates.controller';
import { WorkoutTemplatesController } from './delivery/controllers/workout-templates/workout-templates.controller';
import { WorkoutsController } from './delivery/controllers/workouts/workouts.controller';
import { ExerciseDtoMapper } from './delivery/mappers/exercise-dto.mapper';
import { ExerciseTemplateDtoMapper } from './delivery/mappers/exercise-template-dto.mapper';
import { SeriesDtoMapper } from './delivery/mappers/series-dto.mapper';
import { WorkoutDtoMapper } from './delivery/mappers/workout-dto-mapper';
import { WorkoutTemplateDtoMapper } from './delivery/mappers/workout-template-dto.mapper';
import { CreateExerciseTemplateHandler } from './domain/commands/create-exercise-template/create-exercise-template.handler';
import { CreateWorkoutTemplateHandler } from './domain/commands/create-workout-template/create-workout-template.handler';
import { CreateWorkoutHandler } from './domain/commands/create-workout/create-workout.handler';
import { DeleteExerciseTemplateHandler } from './domain/commands/delete-exercise-template/delete-exercise-template.handler';
import { DeleteWorkoutTemplateHandler } from './domain/commands/delete-workout-template/delete-workout-template.handler';
import { DeleteWorkoutHandler } from './domain/commands/delete-workout/delete-workout.handler';
import { EditExerciseTemplateHandler } from './domain/commands/edit-exercise-template/edit-exercise-template.handler';
import { EditWorkoutTemplateHandler } from './domain/commands/edit-workout-template/edit-workout-template.handler';
import { EditWorkoutHandler } from './domain/commands/edit-workout/edit-workout.handler';
import { ExerciseTemplateFactory } from './domain/entities/exercise-template/exercise-template.factory';
import { WorkoutTemplateFactory } from './domain/entities/workout-template/workout-template.factory';
import { WorkoutFactory } from './domain/entities/workout/workout.factory';
import { UserExerciseTemplatesHandler } from './domain/queries/user-exercise-templates/user-exercise-templates.handler';
import { UserWorkoutTemplatesHandler } from './domain/queries/user-workout-templates/user-workout-templates.handler';
import { UserWorkoutsHandler } from './domain/queries/user-workouts/user-workouts.handler';
import { ExerciseTemplatesService } from './domain/services/exercise-templates/exercise-templates.service';
import { WorkoutTemplatesService } from './domain/services/workout-templates/workout-templates.service';
import { ExerciseTemplateSchemaMapper } from './gateways/database/exercise-templates/exercise-template-schema.mapper';
import { ExerciseTemplatesRepository } from './gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplateSchema } from './gateways/database/exercise-templates/exercise-template.schema';
import { ExerciseSchemaMapper } from './gateways/database/exercises/exercise-schema.mapper';
import { ExerciseSchema } from './gateways/database/exercises/exercise.schema';
import { SeriesSchemaMapper } from './gateways/database/series/series-schema.mapper';
import { SeriesSchema } from './gateways/database/series/series.schema';
import { WorkoutTemplateSchemaMapper } from './gateways/database/workout-templates/workout-template-schema.mapper';
import {
  WorkoutExerciseTemplateSchema,
  WorkoutTemplateSchema,
} from './gateways/database/workout-templates/workout-template.schema';
import { WorkoutTemplatesRepository } from './gateways/database/workout-templates/workout-templates.repository';
import { WorkoutSchemaMapper } from './gateways/database/workouts/workout-schema.mapper';
import { WorkoutRepository } from './gateways/database/workouts/workout.repository';
import { WorkoutSchema } from './gateways/database/workouts/workout.schema';

const schemaMappers = [
  WorkoutTemplateSchemaMapper,
  ExerciseTemplateSchemaMapper,
  SeriesSchemaMapper,
  ExerciseSchemaMapper,
  WorkoutSchemaMapper,
];
const repositories = [
  WorkoutTemplatesRepository,
  ExerciseTemplatesRepository,
  WorkoutRepository,
];
const services = [WorkoutTemplatesService, ExerciseTemplatesService];
const entityFactories = [
  WorkoutTemplateFactory,
  ExerciseTemplateFactory,
  WorkoutFactory,
];
const dtoMappers = [
  WorkoutTemplateDtoMapper,
  ExerciseTemplateDtoMapper,
  SeriesDtoMapper,
  ExerciseDtoMapper,
  WorkoutDtoMapper,
];
const commandHandlers = [
  CreateWorkoutTemplateHandler,
  CreateExerciseTemplateHandler,
  DeleteWorkoutTemplateHandler,
  DeleteExerciseTemplateHandler,
  EditExerciseTemplateHandler,
  EditWorkoutTemplateHandler,
  CreateWorkoutHandler,
  EditWorkoutHandler,
  DeleteWorkoutHandler,
];
const queryHandlers = [
  UserWorkoutTemplatesHandler,
  UserExerciseTemplatesHandler,
  UserWorkoutsHandler,
];

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([
      ExerciseTemplateSchema,
      WorkoutTemplateSchema,
      WorkoutExerciseTemplateSchema,
      SeriesSchema,
      ExerciseSchema,
      WorkoutSchema,
    ]),
  ],
  controllers: [
    WorkoutTemplatesController,
    ExerciseTemplatesController,
    WorkoutsController,
  ],
  providers: [
    ...schemaMappers,
    ...repositories,
    ...services,
    ...entityFactories,
    ...commandHandlers,
    ...queryHandlers,
    ...dtoMappers,
  ],
})
export class WorkoutsModule {}
