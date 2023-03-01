import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import { WorkoutTemplatesService } from '../../services/workout-templates/workout-templates.service';
import {
  EditWorkoutTemplateCommand,
  WorkoutTemplateEditableData,
} from './edit-workout-template.command';

@CommandHandler(EditWorkoutTemplateCommand)
export class EditWorkoutTemplateHandler
  implements ICommandHandler<EditWorkoutTemplateCommand>
{
  private readonly logger = new Logger(EditWorkoutTemplateHandler.name);

  constructor(
    private readonly workoutTemplatesService: WorkoutTemplatesService,
    private readonly workoutTemplatesRepo: WorkoutTemplatesRepository,
    private readonly exerciseTemplatesService: ExerciseTemplatesService,
  ) {}

  async execute(command: EditWorkoutTemplateCommand): Promise<WorkoutTemplate> {
    const { userId, templateId, data } = command;

    const template = await this.workoutTemplatesRepo.findOneById(templateId);
    if (template.createdById !== userId)
      throw new UserDoesNotOwnTheResourceException();

    const editedTemplate = await this.editTemplate(template, data, userId);
    const reloadedTemplate = await this.workoutTemplatesRepo.save(
      editedTemplate,
    );

    return reloadedTemplate;
  }

  private async editTemplate(
    template: WorkoutTemplate,
    data: WorkoutTemplateEditableData,
    userId: string,
  ): Promise<WorkoutTemplate> {
    if (data.name) {
      await this.workoutTemplatesService.checkIfNameIsOccupied(
        data.name,
        userId,
      );
      template.name = data.name;
    }

    if (data.exerciseTemplateIds) {
      template.exerciseTemplates =
        await this.exerciseTemplatesService.getExerciseTemplatesByIds(
          data.exerciseTemplateIds,
        );
    }

    return template;
  }
}
