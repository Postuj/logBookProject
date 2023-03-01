import { TestBed } from '@automock/jest';
import { DeleteWorkoutTemplateHandler } from './delete-workout-template.handler';
import { DeleteWorkoutTemplateCommand } from './delete-workout-template.command';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';

describe('DeleteWorkoutTemplateHandler', () => {
  let uut: DeleteWorkoutTemplateHandler;
  let workoutTemplatesRepo: jest.Mocked<WorkoutTemplatesRepository>;

  const userId = 'testUserId';

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      DeleteWorkoutTemplateHandler,
    ).compile();
    uut = unit;

    workoutTemplatesRepo = unitRef.get(WorkoutTemplatesRepository);
  });

  it('should delete workout template', async () => {
    // arrange
    const templateId = 'testId';
    const template = new WorkoutTemplate(
      templateId,
      'test',
      [],
      userId,
      new Date(),
    );
    workoutTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    workoutTemplatesRepo.deleteOneById.mockResolvedValueOnce(null);
    const command = new DeleteWorkoutTemplateCommand(userId, templateId);

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toBe(undefined);
    expect(workoutTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(workoutTemplatesRepo.deleteOneById).toHaveBeenCalledWith(templateId);
  });

  it('should throw an error if workout template was not found', async () => {
    // arrange
    const templateId = 'testId';
    const exception = new EntityNotFoundException();
    workoutTemplatesRepo.findOneById.mockRejectedValueOnce(exception);
    const command = new DeleteWorkoutTemplateCommand(userId, templateId);

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(exception);
    expect(workoutTemplatesRepo.deleteOneById).not.toHaveBeenCalled();
  });

  it('should throw an error if user does not own workout template', async () => {
    // arrange
    const templateId = 'testId';
    const template = new WorkoutTemplate(
      templateId,
      'test',
      [],
      'otherUserId',
      new Date(),
    );
    workoutTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    const command = new DeleteWorkoutTemplateCommand(userId, templateId);

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserDoesNotOwnTheResourceException(),
    );
    expect(workoutTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(workoutTemplatesRepo.deleteOneById).not.toHaveBeenCalled();
  });
});
