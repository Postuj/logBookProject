import { TestBed } from '@automock/jest';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { UserExerciseTemplatesHandler } from './user-exercise-templates.handler';
import { UserExerciseTemplatesQuery } from './user-exercise-templates.query';

describe('UserExerciseTemplatesHandler', () => {
  let uut: UserExerciseTemplatesHandler;
  let exerciseTemplatesRepo: jest.Mocked<ExerciseTemplatesRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      UserExerciseTemplatesHandler,
    ).compile();
    uut = unit;

    exerciseTemplatesRepo = unitRef.get(ExerciseTemplatesRepository);
  });

  it('should call repo to get data', async () => {
    // arrange
    const userId = 'testUseId';
    const template = new ExerciseTemplate(
      'testId',
      'test',
      {
        hasRepetitions: true,
        hasWeight: true,
        hasTime: true,
      },
      userId,
    );
    exerciseTemplatesRepo.findByUserId.mockResolvedValueOnce([template]);
    const query = new UserExerciseTemplatesQuery(userId);
    // act
    const result = await uut.execute(query);
    // assert
    expect(result).toEqual([template]);
    expect(exerciseTemplatesRepo.findByUserId).toHaveBeenCalledWith(userId);
  });
});
