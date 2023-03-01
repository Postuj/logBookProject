import { TestBed } from '@automock/jest';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { ExerciseTemplateNameOccupiedException } from '../../exceptions/exceptions';
import { ExerciseTemplatesService } from './exercise-templates.service';

describe('ExerciseTemplatesService', () => {
  let uut: ExerciseTemplatesService;
  let exerciseTemplatesRepo: jest.Mocked<ExerciseTemplatesRepository>;

  const userId = 'testUserId';

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      ExerciseTemplatesService,
    ).compile();
    uut = unit;

    exerciseTemplatesRepo = unitRef.get(ExerciseTemplatesRepository);
  });

  describe('#getExerciseTemplatesByIds', () => {
    it('should use only unique exercise ids when creating new workout template', async () => {
      // arrange
      const templates = [
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
      const ids = ['one', 'one', 'two', 'two'];
      exerciseTemplatesRepo.findManyByIds.mockResolvedValueOnce(templates);

      // act
      const result = await uut.getExerciseTemplatesByIds(ids);

      // assert
      expect(result).toEqual(templates);
      expect(exerciseTemplatesRepo.findManyByIds).toHaveBeenCalledWith([
        'one',
        'two',
      ]);
    });

    it('should throw an error if exercise not found', async () => {
      // arrange
      const ids = ['one', 'two'];
      const exerciseTemplates = [
        new ExerciseTemplate(
          'one',
          'test1',
          { hasRepetitions: true, hasWeight: true, hasTime: true },
          userId,
        ),
      ];
      exerciseTemplatesRepo.findManyByIds.mockResolvedValueOnce(
        exerciseTemplates,
      );

      // act & assert error
      expect(uut.getExerciseTemplatesByIds(ids)).rejects.toEqual(
        new EntityNotFoundException(),
      );
    });
  });

  describe('#checkIfNameIsOccupied', () => {
    const name = 'testExerciseName';
    it('should not throw an error if name is free', async () => {
      // arrange
      exerciseTemplatesRepo.findOneByNameAndUser.mockResolvedValueOnce(null);
      // act
      const result = await uut.checkIfNameIsOccupied(name, userId);
      // assert
      expect(result).toEqual(undefined);
      expect(exerciseTemplatesRepo.findOneByNameAndUser).toHaveBeenCalledWith(
        name,
        userId,
      );
    });

    it('should throw an error if name is occupied', async () => {
      // arrange
      const template = new ExerciseTemplate(
        'testId',
        name,
        { hasRepetitions: true, hasWeight: true, hasTime: true },
        userId,
      );
      exerciseTemplatesRepo.findOneByNameAndUser.mockResolvedValueOnce(
        template,
      );
      // act & assert error
      expect(uut.checkIfNameIsOccupied(name, userId)).rejects.toEqual(
        new ExerciseTemplateNameOccupiedException(),
      );
      expect(exerciseTemplatesRepo.findOneByNameAndUser).toHaveBeenCalledWith(
        name,
        userId,
      );
    });
  });
});
