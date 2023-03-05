import { TestBed } from '@automock/jest';
import { DeleteWorkoutHandler } from './delete-workout.handler';
import { DeleteWorkoutCommand } from './delete-workout.command';
import { WorkoutRepository } from '../../../gateways/database/workouts/workout.repository';
import { Series } from '../../entities/series/series.entity';
import { Exercise } from '../../entities/exercise/exercise.entity';
import { Workout } from '../../entities/workout/workout.entity';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';

describe('DeleteWorkoutHandler', () => {
  let uut: DeleteWorkoutHandler;
  let workoutsRepo: jest.Mocked<WorkoutRepository>;

  const userId = 'testUserId';
  const workoutId = 'testWorkoutId';

  const createWorkout = (createdById?: string) =>
    new Workout(
      workoutId,
      'testWorkout',
      createdById ?? userId,
      [
        new Exercise(
          'exercise1Id',
          workoutId,
          'plank',
          {
            hasRepetitions: true,
            hasWeight: false,
            hasTime: false,
          },
          [new Series('series1Id', 'exercise1Id', { seconds: 120 })],
          'plantTemplateId',
        ),
      ],
      new Date(),
      new Date(),
    );

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DeleteWorkoutHandler).compile();
    uut = unit;

    workoutsRepo = unitRef.get(WorkoutRepository);
  });

  it('should delete workout', async () => {
    // arrange
    const workout = createWorkout();
    workoutsRepo.findOneById.mockResolvedValueOnce(workout);
    workoutsRepo.remove.mockResolvedValueOnce(null);
    const command = new DeleteWorkoutCommand(userId, workoutId);

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toEqual(undefined);
    expect(workoutsRepo.findOneById).toHaveBeenCalledWith(workoutId);
    expect(workoutsRepo.remove).toHaveBeenCalledWith(workout);
  });

  it('should not allow to delete workout other user workout', async () => {
    // arrange
    const workout = createWorkout('otherUserId');
    workoutsRepo.findOneById.mockResolvedValueOnce(workout);
    const command = new DeleteWorkoutCommand(userId, workoutId);

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserDoesNotOwnTheResourceException(),
    );
    expect(workoutsRepo.findOneById).toHaveBeenCalledWith(workoutId);
    expect(workoutsRepo.remove).not.toHaveBeenCalled();
  });
});
