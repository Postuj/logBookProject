import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import {
  EditExerciseTemplateCommand,
  ExerciseTemplateEditableData,
} from './edit-exercise-template.command';

@CommandHandler(EditExerciseTemplateCommand)
export class EditExerciseTemplateHandler
  implements ICommandHandler<EditExerciseTemplateCommand>
{
  private readonly logger = new Logger(EditExerciseTemplateHandler.name);

  constructor(
    private readonly exerciseTemplatesRepo: ExerciseTemplatesRepository,
    private readonly exerciseTemplatesService: ExerciseTemplatesService,
  ) {}

  async execute(
    command: EditExerciseTemplateCommand,
  ): Promise<ExerciseTemplate> {
    const { userId, exerciseTemplateId, data } = command;
    const template = await this.exerciseTemplatesRepo.findOneById(
      exerciseTemplateId,
    );

    if (template.createdById !== userId)
      throw new UserDoesNotOwnTheResourceException();

    const editedTemplate = await this.editTemplate(template, data, userId);
    const reloadedTemplate = await this.exerciseTemplatesRepo.save(
      editedTemplate,
    );
    return reloadedTemplate;
  }

  private async editTemplate(
    template: ExerciseTemplate,
    data: ExerciseTemplateEditableData,
    userId: string,
  ): Promise<ExerciseTemplate> {
    if (data.name) {
      await this.exerciseTemplatesService.checkIfNameIsOccupied(
        data.name,
        userId,
      );
      template.name = data.name;
    }
    const options = template.options;
    if (data.hasRepetitions !== undefined)
      options.hasRepetitions = data.hasRepetitions;
    if (data.hasWeight !== undefined) options.hasWeight = data.hasWeight;
    if (data.hasTime !== undefined) options.hasTime = data.hasTime;
    template.options = options;

    return template;
  }
}
