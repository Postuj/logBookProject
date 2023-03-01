import { TestBed } from '@automock/jest';
import { DeleteExerciseTemplateHandler } from './delete-exercise-template.handler';
import { DeleteExerciseTemplateCommand } from './delete-exercise-template.command';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';

describe('DeleteExerciseTemplateHandler', () => {
  let uut: DeleteExerciseTemplateHandler;
  let exerciseTemplatesRepo: jest.Mocked<ExerciseTemplatesRepository>;

  const userId = 'testUserId';

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      DeleteExerciseTemplateHandler,
    ).compile();
    uut = unit;

    exerciseTemplatesRepo = unitRef.get(ExerciseTemplatesRepository);
  });

  it('should delete exercise template', async () => {
    // arrange
    const templateId = 'testId';
    const template = new ExerciseTemplate(
      templateId,
      'test',
      { hasRepetitions: true, hasWeight: true, hasTime: false },
      userId,
    );
    exerciseTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    exerciseTemplatesRepo.deleteOneById.mockResolvedValueOnce(null);
    const command = new DeleteExerciseTemplateCommand(userId, templateId);

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toBe(undefined);
    expect(exerciseTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(exerciseTemplatesRepo.deleteOneById).toHaveBeenCalledWith(
      templateId,
    );
  });

  it('should throw an error if exercise template was not found', async () => {
    // arrange
    const templateId = 'testId';
    const exception = new EntityNotFoundException();
    exerciseTemplatesRepo.findOneById.mockRejectedValueOnce(exception);
    const command = new DeleteExerciseTemplateCommand(userId, templateId);

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(exception);
    expect(exerciseTemplatesRepo.deleteOneById).not.toHaveBeenCalled();
  });

  it('should throw an error if user does not own exercise template', async () => {
    // arrange
    const templateId = 'testId';
    const template = new ExerciseTemplate(
      templateId,
      'test',
      { hasRepetitions: true, hasWeight: true, hasTime: false },
      'otherUserId',
    );
    exerciseTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    const command = new DeleteExerciseTemplateCommand(userId, templateId);

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserDoesNotOwnTheResourceException(),
    );
    expect(exerciseTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(exerciseTemplatesRepo.deleteOneById).not.toHaveBeenCalled();
  });
});
