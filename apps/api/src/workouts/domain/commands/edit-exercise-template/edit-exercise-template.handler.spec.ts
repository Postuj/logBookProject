import { TestBed } from '@automock/jest';
import { EditExerciseTemplateHandler } from './edit-exercise-template.handler';
import { EditExerciseTemplateCommand } from './edit-exercise-template.command';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateNameOccupiedException } from '../../exceptions/exceptions';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';

describe('EditExerciseTemplateHandler', () => {
  let uut: EditExerciseTemplateHandler;
  let exerciseTemplatesRepo: jest.Mocked<ExerciseTemplatesRepository>;
  let exerciseTemplatesService: jest.Mocked<ExerciseTemplatesService>;

  const userId = 'testUserId';
  const newName = 'newTemplateName';
  const templateId = 'testTemplateId';
  const template = new ExerciseTemplate(
    templateId,
    'test',
    { hasRepetitions: true, hasWeight: true, hasTime: false },
    userId,
  );

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      EditExerciseTemplateHandler,
    ).compile();
    uut = unit;

    exerciseTemplatesRepo = unitRef.get(ExerciseTemplatesRepository);
    exerciseTemplatesService = unitRef.get(ExerciseTemplatesService);
  });

  it('should edit exercise template', async () => {
    // arrange
    const editedTemplate = new ExerciseTemplate(
      templateId,
      newName,
      { hasRepetitions: false, hasWeight: true, hasTime: false },
      userId,
    );
    exerciseTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    exerciseTemplatesService.checkIfNameIsOccupied.mockResolvedValueOnce(null);
    exerciseTemplatesRepo.save.mockResolvedValueOnce(editedTemplate);
    const command = new EditExerciseTemplateCommand(userId, templateId, {
      name: newName,
      hasRepetitions: false,
    });
    // act
    const result = await uut.execute(command);
    // assert
    expect(result).toEqual(editedTemplate);
    expect(exerciseTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(exerciseTemplatesService.checkIfNameIsOccupied).toHaveBeenCalledWith(
      newName,
      userId,
    );
    expect(exerciseTemplatesRepo.save).toHaveBeenCalledWith(editedTemplate);
  });

  it('should not allow to edit if user is not exercise owner', async () => {
    // arrange
    const otherUserTemplate = new ExerciseTemplate(
      templateId,
      'test',
      { hasRepetitions: false, hasWeight: true, hasTime: false },
      'otherUserId',
    );
    exerciseTemplatesRepo.findOneById.mockResolvedValueOnce(otherUserTemplate);
    const command = new EditExerciseTemplateCommand(userId, templateId, {
      name: newName,
      hasRepetitions: false,
    });

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserDoesNotOwnTheResourceException(),
    );
    expect(exerciseTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(
      exerciseTemplatesService.checkIfNameIsOccupied,
    ).not.toHaveBeenCalled();
    expect(exerciseTemplatesRepo.save).not.toHaveBeenCalled();
  });

  it('should not allow to edit if edited name is already occupied', async () => {
    // arrange
    exerciseTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    exerciseTemplatesService.checkIfNameIsOccupied.mockRejectedValueOnce(
      new ExerciseTemplateNameOccupiedException(),
    );
    const command = new EditExerciseTemplateCommand(userId, templateId, {
      name: newName,
      hasRepetitions: false,
    });

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new ExerciseTemplateNameOccupiedException(),
    );
    expect(exerciseTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(exerciseTemplatesRepo.save).not.toHaveBeenCalled();
  });
});
