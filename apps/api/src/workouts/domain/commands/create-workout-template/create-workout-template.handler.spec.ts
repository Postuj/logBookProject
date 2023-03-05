import { TestBed } from '@automock/jest';
import { CreateWorkoutTemplateHandler } from './create-workout-template.handler';
import { CreateWorkoutTemplateCommand } from './create-workout-template.command';
import { WorkoutTemplateFactory } from '../../entities/workout-template/workout-template.factory';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { WorkoutTemplateNameOccupiedException } from '../../exceptions/exceptions';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import { WorkoutTemplatesService } from '../../services/workout-templates/workout-templates.service';

describe('CreateWorkoutTemplateHandler', () => {
  let uut: CreateWorkoutTemplateHandler;
  let workoutTemplatesService: jest.Mocked<WorkoutTemplatesService>;
  let workoutTemplateFactory: jest.Mocked<WorkoutTemplateFactory>;
  let exerciseTemplatesService: jest.Mocked<ExerciseTemplatesService>;

  const userId = 'testUserId';

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      CreateWorkoutTemplateHandler,
    ).compile();
    uut = unit;

    workoutTemplatesService = unitRef.get(WorkoutTemplatesService);
    workoutTemplateFactory = unitRef.get(WorkoutTemplateFactory);
    exerciseTemplatesService = unitRef.get(ExerciseTemplatesService);
  });

  it('should create new workout template without exercises', async () => {
    // arrange
    const name = 'testWorkoutTemplate';
    const exerciseTemplateIds = [];
    const command = new CreateWorkoutTemplateCommand(
      userId,
      name,
      exerciseTemplateIds,
    );
    const workoutTemplate = new WorkoutTemplate(
      'testWorkout',
      name,
      [],
      userId,
      null,
    );
    workoutTemplatesService.checkIfNameIsOccupied.mockResolvedValueOnce(null);
    workoutTemplateFactory.create.mockResolvedValueOnce(workoutTemplate);

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toEqual(workoutTemplate);
    expect(workoutTemplatesService.checkIfNameIsOccupied).toHaveBeenCalledWith(
      name,
      userId,
    );
    expect(
      exerciseTemplatesService.getExerciseTemplatesByIds,
    ).not.toHaveBeenCalled();
    expect(workoutTemplateFactory.create).toHaveBeenCalledWith(
      name,
      userId,
      [],
    );
  });

  it('should create new workout template with exercises', async () => {
    // arrange
    const exerciseTemplates = [
      new ExerciseTemplate(
        'one',
        'test1',
        { hasRepetitions: true, hasWeight: true, hasTime: true },
        userId,
      ),
      new ExerciseTemplate(
        'two',
        'test2',
        { hasRepetitions: false, hasWeight: true, hasTime: false },
        userId,
      ),
    ];
    const name = 'testWorkoutTemplate';
    const exerciseTemplateIds = ['one', 'two'];
    const command = new CreateWorkoutTemplateCommand(
      userId,
      name,
      exerciseTemplateIds,
    );
    const workoutTemplate = new WorkoutTemplate(
      'testWorkout',
      'test',
      [],
      userId,
      null,
    );
    workoutTemplatesService.checkIfNameIsOccupied.mockResolvedValueOnce(null);
    workoutTemplateFactory.create.mockResolvedValueOnce(workoutTemplate);
    exerciseTemplatesService.getExerciseTemplatesByIds.mockResolvedValueOnce(
      exerciseTemplates,
    );

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toEqual(workoutTemplate);
    expect(workoutTemplatesService.checkIfNameIsOccupied).toHaveBeenCalledWith(
      name,
      userId,
    );
    expect(
      exerciseTemplatesService.getExerciseTemplatesByIds,
    ).toHaveBeenCalledWith(exerciseTemplateIds);
    expect(workoutTemplateFactory.create).toHaveBeenCalledWith(
      name,
      userId,
      exerciseTemplates,
    );
  });

  it('should not to allow to create workout template with already occupied name', async () => {
    // arrange
    const name = 'testWorkoutTemplate';
    const exerciseTemplateIds = ['one', 'two'];
    const existingTemplate = new WorkoutTemplate(
      'testId',
      name,
      [],
      userId,
      null,
    );
    const command = new CreateWorkoutTemplateCommand(
      userId,
      name,
      exerciseTemplateIds,
    );
    workoutTemplatesService.checkIfNameIsOccupied.mockRejectedValue(
      new WorkoutTemplateNameOccupiedException(),
    );

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new WorkoutTemplateNameOccupiedException(),
    );
    expect(
      exerciseTemplatesService.getExerciseTemplatesByIds,
    ).not.toHaveBeenCalled();
    expect(workoutTemplateFactory.create).not.toHaveBeenCalled();
  });
});
