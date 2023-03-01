import { TestBed } from '@automock/jest';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { UserWorkoutTemplatesHandler } from './user-workout-templates.handler';
import { UserWorkoutTemplatesQuery } from './user-workout-templates.query';

describe('UserWorkoutTemplatesHandler', () => {
  let uut: UserWorkoutTemplatesHandler;
  let workoutTemplatesRepo: jest.Mocked<WorkoutTemplatesRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      UserWorkoutTemplatesHandler,
    ).compile();
    uut = unit;

    workoutTemplatesRepo = unitRef.get(WorkoutTemplatesRepository);
  });

  it('should call repo to get data', async () => {
    // arrange
    const userId = 'testUseId';
    const exerciseTemplate = new ExerciseTemplate(
      'testId',
      'test',
      {
        hasRepetitions: true,
        hasWeight: true,
        hasTime: true,
      },
      userId,
    );
    const template = new WorkoutTemplate(
      'testId',
      'test',
      [exerciseTemplate],
      userId,
      new Date(),
    );
    workoutTemplatesRepo.findByUserId.mockResolvedValueOnce([template]);
    const query = new UserWorkoutTemplatesQuery(userId);
    // act
    const result = await uut.execute(query);
    // assert
    expect(result).toEqual([template]);
    expect(workoutTemplatesRepo.findByUserId).toHaveBeenCalledWith(userId);
  });
});
