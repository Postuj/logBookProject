import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateFactory } from '../../entities/exercise-template/exercise-template.factory';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import { CreateExerciseTemplateCommand } from './create-exercise-template.command';

@CommandHandler(CreateExerciseTemplateCommand)
export class CreateExerciseTemplateHandler
  implements ICommandHandler<CreateExerciseTemplateCommand>
{
  private readonly logger = new Logger(CreateExerciseTemplateHandler.name);

  constructor(
    private readonly exerciseTemplatesService: ExerciseTemplatesService,
    private readonly exerciseTemplateFactory: ExerciseTemplateFactory,
  ) {}

  async execute(
    command: CreateExerciseTemplateCommand,
  ): Promise<ExerciseTemplate> {
    const { userId, name, options } = command;

    await this.exerciseTemplatesService.checkIfNameIsOccupied(name, userId);

    this.logger.log('Createing exercise template for User@' + userId);
    const template = await this.exerciseTemplateFactory.create(
      name,
      options,
      userId,
    );
    return template;
  }
}
