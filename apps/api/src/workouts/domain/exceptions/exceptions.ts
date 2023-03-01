import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class WorkoutTemplateNameOccupiedException extends ForbiddenException {
  constructor() {
    super('This workout template name is already occupied');
  }
}

export class ExerciseTemplateNameOccupiedException extends ForbiddenException {
  constructor() {
    super('This exercise template name is already occupied');
  }
}
