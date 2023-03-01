import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { WorkoutTemplateFactory } from '../../entities/workout-template/workout-template.factory';
import { CreateWorkoutTemplateCommand } from './create-workout-template.command';
import { WorkoutTemplatesService } from '../../services/workout-templates/workout-templates.service';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';

@CommandHandler(CreateWorkoutTemplateCommand)
export class CreateWorkoutTemplateHandler
  implements ICommandHandler<CreateWorkoutTemplateCommand>
{
  private readonly logger = new Logger(CreateWorkoutTemplateHandler.name);

  constructor(
    private readonly workoutTemplatesService: WorkoutTemplatesService,
    private readonly workoutTemplateFactory: WorkoutTemplateFactory,
    private readonly exerciseTemplatesService: ExerciseTemplatesService,
  ) {}

  async execute(
    command: CreateWorkoutTemplateCommand,
  ): Promise<WorkoutTemplate> {
    const { userId, name, exerciseTemplateIds } = command;

    await this.workoutTemplatesService.checkIfNameIsOccupied(name, userId);

    const exerciseTemplates = await this.getExerciseTemplates(
      exerciseTemplateIds,
    );

    this.logger.log('Creating workout template for user User@' + userId);
    const workoutTemplate = await this.workoutTemplateFactory.create(
      name,
      userId,
      exerciseTemplates,
    );

    return workoutTemplate;
  }

  private async getExerciseTemplates(
    ids: string[],
  ): Promise<ExerciseTemplate[]> {
    if (ids.length === 0) return [];
    const templates =
      await this.exerciseTemplatesService.getExerciseTemplatesByIds(ids);
    return templates;
  }
}
