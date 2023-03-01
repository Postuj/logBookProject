import { TestBed } from '@automock/jest';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { WorkoutTemplateNameOccupiedException } from '../../exceptions/exceptions';
import { WorkoutTemplatesService } from './workout-templates.service';

describe('WorkoutService', () => {
  let uut: WorkoutTemplatesService;
  let workoutTemplatesRepo: jest.Mocked<WorkoutTemplatesRepository>;

  const userId = 'testUserId';

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(WorkoutTemplatesService).compile();
    uut = unit;

    workoutTemplatesRepo = unitRef.get(WorkoutTemplatesRepository);
  });

  describe('#checkIfWorkoutTemplateNameIsOccupied', () => {
    const name = 'testExerciseName';
    it('should not throw an error if name is free', async () => {
      // arrange
      workoutTemplatesRepo.findOneByNameAndUser.mockResolvedValueOnce(null);
      // act
      const result = await uut.checkIfNameIsOccupied(name, userId);
      // assert
      expect(result).toEqual(undefined);
      expect(workoutTemplatesRepo.findOneByNameAndUser).toHaveBeenCalledWith(
        name,
        userId,
      );
    });

    it('should throw an error if name is occupied', async () => {
      // arrange
      const template = new WorkoutTemplate(
        'testId',
        name,
        [],
        userId,
        new Date(),
      );
      workoutTemplatesRepo.findOneByNameAndUser.mockResolvedValueOnce(template);
      // act & assert error
      expect(uut.checkIfNameIsOccupied(name, userId)).rejects.toEqual(
        new WorkoutTemplateNameOccupiedException(),
      );
      expect(workoutTemplatesRepo.findOneByNameAndUser).toHaveBeenCalledWith(
        name,
        userId,
      );
    });
  });
});
