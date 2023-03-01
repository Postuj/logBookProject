import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ExerciseTemplatesController } from './delivery/controllers/exercise-templates/exercise-templates.controller';
import { WorkoutTemplatesController } from './delivery/controllers/workout-templates/workout-templates.controller';
import { ExerciseTemplateDtoMapper } from './delivery/mappers/exercise-template-dto.mapper';
import { WorkoutTemplateDtoMapper } from './delivery/mappers/workout-template-dto.mapper';
import { CreateExerciseTemplateHandler } from './domain/commands/create-exercise-template/create-exercise-template.handler';
import { CreateWorkoutTemplateHandler } from './domain/commands/create-workout-template/create-workout-template.handler';
import { DeleteExerciseTemplateHandler } from './domain/commands/delete-exercise-template/delete-exercise-template.handler';
import { DeleteWorkoutTemplateHandler } from './domain/commands/delete-workout-template/delete-workout-template.handler';
import { EditExerciseTemplateHandler } from './domain/commands/edit-exercise-template/edit-exercise-template.handler';
import { EditWorkoutTemplateHandler } from './domain/commands/edit-workout-template/edit-workout-template.handler';
import { ExerciseTemplateFactory } from './domain/entities/exercise-template/exercise-template.factory';
import { WorkoutTemplateFactory } from './domain/entities/workout-template/workout-template.factory';
import { UserExerciseTemplatesHandler } from './domain/queries/user-exercise-templates/user-exercise-templates.handler';
import { UserWorkoutTemplatesHandler } from './domain/queries/user-workout-templates/user-workout-templates.handler';
import { ExerciseTemplatesService } from './domain/services/exercise-templates/exercise-templates.service';
import { WorkoutTemplatesService } from './domain/services/workout-templates/workout-templates.service';
import { ExerciseTemplateSchemaMapper } from './gateways/database/exercise-templates/exercise-template-schema.mapper';
import { ExerciseTemplatesRepository } from './gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplateSchema } from './gateways/database/exercise-templates/exercise-template.schema';
import { WorkoutTemplateSchemaMapper } from './gateways/database/workout-templates/workout-template-schema.mapper';
import {
  WorkoutExerciseTemplateSchema,
  WorkoutTemplateSchema,
} from './gateways/database/workout-templates/workout-template.schema';
import { WorkoutTemplatesRepository } from './gateways/database/workout-templates/workout-templates.repository';

const schemaMappers = [
  WorkoutTemplateSchemaMapper,
  ExerciseTemplateSchemaMapper,
];
const repositories = [WorkoutTemplatesRepository, ExerciseTemplatesRepository];
const services = [WorkoutTemplatesService, ExerciseTemplatesService];
const entityFactories = [WorkoutTemplateFactory, ExerciseTemplateFactory];
const dtoMappers = [WorkoutTemplateDtoMapper, ExerciseTemplateDtoMapper];
const commandHandlers = [
  CreateWorkoutTemplateHandler,
  CreateExerciseTemplateHandler,
  DeleteWorkoutTemplateHandler,
  DeleteExerciseTemplateHandler,
  EditExerciseTemplateHandler,
  EditWorkoutTemplateHandler,
];
const queryHandlers = [
  UserWorkoutTemplatesHandler,
  UserExerciseTemplatesHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      ExerciseTemplateSchema,
      WorkoutTemplateSchema,
      WorkoutExerciseTemplateSchema,
    ]),
    UsersModule,
  ],
  controllers: [WorkoutTemplatesController, ExerciseTemplatesController],
  providers: [
    ...schemaMappers,
    ...repositories,
    ...services,
    ...entityFactories,
    ...dtoMappers,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class WorkoutsModule {}
