import { TestBed } from '@automock/jest';
import { CreateExerciseTemplateHandler } from './create-exercise-template.handler';
import { CreateExerciseTemplateCommand } from './create-exercise-template.command';
import { ExerciseTemplateFactory } from '../../entities/exercise-template/exercise-template.factory';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateNameOccupiedException } from '../../exceptions/exceptions';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';

describe('CreateExerciseTemplateHandler', () => {
  let uut: CreateExerciseTemplateHandler;
  let exerciseTemplatesService: jest.Mocked<ExerciseTemplatesService>;
  let exerciseTemplateFactory: jest.Mocked<ExerciseTemplateFactory>;

  const userId = 'testUserId';

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      CreateExerciseTemplateHandler,
    ).compile();
    uut = unit;

    exerciseTemplatesService = unitRef.get(ExerciseTemplatesService);
    exerciseTemplateFactory = unitRef.get(ExerciseTemplateFactory);
  });

  it('should create exercise template', async () => {
    // arrange
    const name = 'exerciseTemplateName';
    const options = { hasRepetitions: true, hasWeight: true, hasTime: false };
    const template = new ExerciseTemplate('testId', name, options, userId);
    exerciseTemplatesService.checkIfNameIsOccupied.mockResolvedValueOnce(null);
    exerciseTemplateFactory.create.mockResolvedValueOnce(template);
    const command = new CreateExerciseTemplateCommand(userId, name, options);
    // act
    const result = await uut.execute(command);
    // assert
    expect(result).toEqual(template);
    expect(exerciseTemplatesService.checkIfNameIsOccupied).toHaveBeenCalledWith(
      name,
      userId,
    );
    expect(exerciseTemplateFactory.create).toHaveBeenCalledWith(
      name,
      options,
      userId,
    );
  });

  it('should not allow to create exercise template with already occupied name', async () => {
    // arrange
    const name = 'exerciseTemplateName';
    const options = { hasRepetitions: true, hasWeight: true, hasTime: false };
    const template = new ExerciseTemplate('testId', name, options, userId);
    exerciseTemplatesService.checkIfNameIsOccupied.mockRejectedValueOnce(
      new ExerciseTemplateNameOccupiedException(),
    );
    const command = new CreateExerciseTemplateCommand(userId, name, options);
    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new ExerciseTemplateNameOccupiedException(),
    );
    expect(exerciseTemplateFactory.create).not.toHaveBeenCalled();
  });
});
