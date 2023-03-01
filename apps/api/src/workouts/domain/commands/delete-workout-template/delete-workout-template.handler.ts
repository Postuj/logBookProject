import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { DeleteWorkoutTemplateCommand } from './delete-workout-template.command';

@CommandHandler(DeleteWorkoutTemplateCommand)
export class DeleteWorkoutTemplateHandler
  implements ICommandHandler<DeleteWorkoutTemplateCommand>
{
  private readonly logger = new Logger(DeleteWorkoutTemplateHandler.name);

  constructor(
    private readonly workoutTemplateRepo: WorkoutTemplatesRepository,
  ) {}

  async execute(command: DeleteWorkoutTemplateCommand): Promise<void> {
    const { userId, templateId } = command;
    const template = await this.workoutTemplateRepo.findOneById(templateId);

    if (template.createdById !== userId)
      throw new UserDoesNotOwnTheResourceException();

    await this.deleteWorkoutTemplate(template);
    this.logger.log(`User@${userId} deleted workoutTemplate@${templateId}`);
  }

  private async deleteWorkoutTemplate(template: WorkoutTemplate) {
    try {
      await this.workoutTemplateRepo.deleteOneById(template.id);
    } catch (_) {
      this.logger.error('Cannot delete workoutTemplate@' + template.id);
    }
  }
}
