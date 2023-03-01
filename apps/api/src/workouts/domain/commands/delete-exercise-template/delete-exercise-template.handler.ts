import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { DeleteExerciseTemplateCommand } from './delete-exercise-template.command';

@CommandHandler(DeleteExerciseTemplateCommand)
export class DeleteExerciseTemplateHandler
  implements ICommandHandler<DeleteExerciseTemplateCommand>
{
  private readonly logger = new Logger(DeleteExerciseTemplateHandler.name);

  constructor(
    private readonly exerciseTemplatesRepo: ExerciseTemplatesRepository,
  ) {}

  async execute(command: DeleteExerciseTemplateCommand): Promise<void> {
    const { userId, templateId } = command;
    const template = await this.exerciseTemplatesRepo.findOneById(templateId);

    if (template.createdById !== userId)
      throw new UserDoesNotOwnTheResourceException();

    await this.deleteExerciseTemplate(template);
    this.logger.log(`User@${userId} deleted exerciseTemplate@${templateId}`);
  }

  private async deleteExerciseTemplate(template: ExerciseTemplate) {
    try {
      await this.exerciseTemplatesRepo.deleteOneById(template.id);
    } catch (_) {
      this.logger.error('Cannot delete exerciseTemplate@' + template.id);
    }
  }
}
