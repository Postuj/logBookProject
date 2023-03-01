import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { UserExerciseTemplatesQuery } from './user-exercise-templates.query';

@QueryHandler(UserExerciseTemplatesQuery)
export class UserExerciseTemplatesHandler
  implements IQueryHandler<UserExerciseTemplatesQuery>
{
  private readonly logger = new Logger(UserExerciseTemplatesHandler.name);

  constructor(
    private readonly exerciseTemplateRepo: ExerciseTemplatesRepository,
  ) {}

  execute(query: UserExerciseTemplatesQuery): Promise<ExerciseTemplate[]> {
    return this.exerciseTemplateRepo.findByUserId(query.userId);
  }
}
