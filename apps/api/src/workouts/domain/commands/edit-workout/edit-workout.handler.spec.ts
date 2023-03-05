import { TestBed } from '@automock/jest';
import { EditWorkoutHandler } from './edit-workout.handler';
import { EditWorkoutCommand } from './edit-workout.command';
import { WorkoutRepository } from '../../../gateways/database/workouts/workout.repository';
import { WorkoutFactory } from '../../entities/workout/workout.factory';
import { Workout } from '../../entities/workout/workout.entity';
import { Exercise } from '../../entities/exercise/exercise.entity';
import { Series } from '../../entities/series/series.entity';
import { WorkoutProps } from '../../interfaces/interfaces';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { cloneDeep } from 'lodash';

describe('EditWorkoutHandler', () => {
  let uut: EditWorkoutHandler;
  let workoutsRepo: jest.Mocked<WorkoutRepository>;
  let workoutFactory: jest.Mocked<WorkoutFactory>;

  const userId = 'testUserId';
  const workoutId = 'testWorkoutId';
  const props: WorkoutProps = {
    name: 'testWorkout',
    exercises: [
      {
        id: 'exercise1Id',
        templateId: 'plankTemplate',
        name: 'plank',
        hasRepetitions: false,
        hasWeight: false,
        hasTime: true,
        series: [{ seconds: 120, id: 'series1Id' }],
      },
      {
        templateId: 'flatBenchPressTemplate',
        name: 'plank',
        hasRepetitions: true,
        hasWeight: true,
        hasTime: false,
        series: [
          { weight: 80.5, repetitions: 10 },
          { weight: 86, repetitions: 8 },
        ],
      },
    ],
  };

  const createWorkout = (createdById?: string) =>
    new Workout(
      workoutId,
      props.name,
      createdById ?? userId,
      [
        new Exercise(
          'exercise1Id',
          workoutId,
          props.exercises[0].name,
          {
            hasRepetitions: props.exercises[0].hasRepetitions,
            hasWeight: props.exercises[0].hasWeight,
            hasTime: props.exercises[0].hasTime,
          },
          [new Series('series1Id', 'exercise1Id', { seconds: 120 })],
          props.exercises[0].templateId,
        ),
      ],
      new Date(),
      new Date(),
    );

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(EditWorkoutHandler).compile();
    uut = unit;

    workoutsRepo = unitRef.get(WorkoutRepository);
    workoutFactory = unitRef.get(WorkoutFactory);
  });

  it('should edit workout', async () => {
    // arrange
    const workout = createWorkout();
    const editedWorkout: Workout = cloneDeep(workout);
    editedWorkout.exercises = [
      ...editedWorkout.exercises,
      new Exercise(
        'exercise2Id',
        workoutId,
        props.exercises[1].name,
        {
          hasRepetitions: props.exercises[1].hasRepetitions,
          hasWeight: props.exercises[1].hasWeight,
          hasTime: props.exercises[1].hasTime,
        },
        [
          new Series('series2Id', 'exercise2Id', {
            weight: 80.5,
            repetitions: 10,
          }),
          new Series('series3Id', 'exercise2Id', {
            weight: 86,
            repetitions: 8,
          }),
        ],
        props.exercises[0].templateId,
      ),
    ];
    workoutsRepo.findOneById.mockResolvedValueOnce(workout);
    workoutFactory.recreateFromProps.mockResolvedValueOnce(editedWorkout);
    workoutsRepo.save.mockResolvedValueOnce(editedWorkout);
    const command = new EditWorkoutCommand(userId, workoutId, props);

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toEqual(editedWorkout);
    expect(workoutsRepo.findOneById).toHaveBeenCalledWith(workoutId);
    expect(workoutFactory.recreateFromProps).toHaveBeenCalledWith(
      workoutId,
      userId,
      props,
      workout.finishedAt,
    );
    expect(workoutsRepo.save).toHaveBeenCalledWith(editedWorkout);
  });

  it('should not allow to edit workout other user workout', async () => {
    // arrange
    const workout = createWorkout('otherUserId');
    workoutsRepo.findOneById.mockResolvedValueOnce(workout);
    const command = new EditWorkoutCommand(userId, workoutId, props);

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserDoesNotOwnTheResourceException(),
    );
    expect(workoutsRepo.findOneById).toHaveBeenCalledWith(workoutId);
    expect(workoutFactory.recreateFromProps).not.toHaveBeenCalled();
    expect(workoutsRepo.save).not.toHaveBeenCalled();
  });
});
