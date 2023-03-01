import { TestBed } from '@automock/jest';
import { ExerciseTemplatesService } from '../../services/exercise-templates/exercise-templates.service';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateNameOccupiedException } from '../../exceptions/exceptions';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { EditWorkoutTemplateHandler } from './edit-workout-template.handler';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { WorkoutTemplatesService } from '../../services/workout-templates/workout-templates.service';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { EditWorkoutTemplateCommand } from './edit-workout-template.command';

describe('EditWorkoutTemplateHandler', () => {
  let uut: EditWorkoutTemplateHandler;
  let workoutTemplatesRepo: jest.Mocked<WorkoutTemplatesRepository>;
  let workoutTemplatesService: jest.Mocked<WorkoutTemplatesService>;
  let exerciseTemplateService: jest.Mocked<ExerciseTemplatesService>;

  const userId = 'testUserId';
  const newName = 'newTemplateName';
  const templateId = 'testTemplateId';
  const exerciseTemplates = [
    new ExerciseTemplate(
      'exercise1Id',
      'exercise1',
      { hasRepetitions: true, hasWeight: true, hasTime: false },
      userId,
    ),
    new ExerciseTemplate(
      'exercise2Id',
      'exercise2',
      { hasRepetitions: false, hasWeight: false, hasTime: true },
      userId,
    ),
  ];
  const template = new WorkoutTemplate(
    templateId,
    'test',
    exerciseTemplates,
    userId,
    new Date(),
  );

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      EditWorkoutTemplateHandler,
    ).compile();
    uut = unit;

    workoutTemplatesRepo = unitRef.get(WorkoutTemplatesRepository);
    workoutTemplatesService = unitRef.get(WorkoutTemplatesService);
    exerciseTemplateService = unitRef.get(ExerciseTemplatesService);
  });

  it('should edit exercise template', async () => {
    // arrange
    const editedTemplate = new WorkoutTemplate(
      templateId,
      newName,
      [exerciseTemplates[1]],
      userId,
      template.createdAt,
    );
    workoutTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    workoutTemplatesService.checkIfNameIsOccupied.mockResolvedValueOnce(null);
    exerciseTemplateService.getExerciseTemplatesByIds.mockResolvedValueOnce([
      exerciseTemplates[1],
    ]);
    workoutTemplatesRepo.save.mockImplementationOnce((entity) =>
      Promise.resolve(entity),
    );
    const command = new EditWorkoutTemplateCommand(userId, templateId, {
      name: newName,
      exerciseTemplateIds: [exerciseTemplates[1].id],
    });

    // act
    const result = await uut.execute(command);

    // assert
    expect(result).toEqual(editedTemplate);
    expect(workoutTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(workoutTemplatesService.checkIfNameIsOccupied).toHaveBeenCalledWith(
      newName,
      userId,
    );
    expect(
      exerciseTemplateService.getExerciseTemplatesByIds,
    ).toHaveBeenLastCalledWith([exerciseTemplates[1].id]);
    expect(workoutTemplatesRepo.save).toHaveBeenCalledWith(editedTemplate);
  });

  it('should not allow to edit if user is not exercise owner', async () => {
    // arrange
    const otherUserTemplate = new WorkoutTemplate(
      templateId,
      'test',
      [],
      'otherUserId',
      new Date(),
    );
    workoutTemplatesRepo.findOneById.mockResolvedValueOnce(otherUserTemplate);
    const command = new EditWorkoutTemplateCommand(userId, templateId, {
      name: newName,
    });

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserDoesNotOwnTheResourceException(),
    );
    expect(workoutTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(
      workoutTemplatesService.checkIfNameIsOccupied,
    ).not.toHaveBeenCalled();
    expect(
      exerciseTemplateService.getExerciseTemplatesByIds,
    ).not.toHaveBeenCalled();
    expect(workoutTemplatesRepo.save).not.toHaveBeenCalled();
  });

  it('should not allow to edit if edited name is already occupied', async () => {
    // arrange
    workoutTemplatesRepo.findOneById.mockResolvedValueOnce(template);
    workoutTemplatesService.checkIfNameIsOccupied.mockRejectedValueOnce(
      new ExerciseTemplateNameOccupiedException(),
    );
    const command = new EditWorkoutTemplateCommand(userId, templateId, {
      name: newName,
    });

    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new ExerciseTemplateNameOccupiedException(),
    );
    expect(workoutTemplatesRepo.findOneById).toHaveBeenCalledWith(templateId);
    expect(
      exerciseTemplateService.getExerciseTemplatesByIds,
    ).not.toHaveBeenCalled();
    expect(workoutTemplatesRepo.save).not.toHaveBeenCalled();
  });
});
