import { TestBed } from '@automock/jest';
import { CreateWorkoutHandler } from './create-workout.handler';
import { CreateWorkoutCommand } from './create-workout.command';
import { WorkoutFactory } from '../../entities/workout/workout.factory';
import { WorkoutProps } from '../../interfaces/interfaces';
import { Workout } from '../../entities/workout/workout.entity';
import { Exercise } from '../../entities/exercise/exercise.entity';
import { Series } from '../../entities/series/series.entity';

describe('CreateWorkoutHandler', () => {
  let uut: CreateWorkoutHandler;
  let workoutFactory: jest.Mocked<WorkoutFactory>;

  const userId = 'testUserId';
  const workoutId = 'testWorkoutId';
  const props: WorkoutProps = {
    name: 'testWorkout',
    exercises: [
      {
        templateId: 'plankTemplate',
        series: [{ seconds: 120 }],
      },
      {
        templateId: 'flatBenchPressTemplate',
        series: [
          { weight: 80.5, repetitions: 10 },
          { weight: 86, repetitions: 8 },
        ],
      },
    ],
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CreateWorkoutHandler).compile();
    uut = unit;

    workoutFactory = unitRef.get(WorkoutFactory);
  });

  it('should create new workout', async () => {
    // arrange
    const workout = new Workout(
      workoutId,
      props.name,
      userId,
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
          props.exercises[1].templateId,
        ),
      ],
      new Date(),
      new Date(),
    );
    workoutFactory.create.mockResolvedValueOnce(workout);
    const command = new CreateWorkoutCommand(userId, props);
    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toEqual(workout);
    expect(workoutFactory.create).toHaveBeenCalledWith(userId, props);
  });
});
