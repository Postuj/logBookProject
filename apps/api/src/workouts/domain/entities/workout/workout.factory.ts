import { Injectable } from '@nestjs/common';
import { EntityFactory } from '../../../../core/entity.factory';
import { WorkoutRepository } from '../../../gateways/database/workouts/workout.repository';
import { Exercise } from '../exercise/exercise.entity';
import { Workout } from './workout.entity';
import { v4 as uuid } from 'uuid';
import { Series } from '../series/series.entity';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import {
  ExerciseProps,
  SeriesProps,
  WorkoutProps,
} from '../../interfaces/interfaces';

@Injectable()
export class WorkoutFactory implements EntityFactory<Workout> {
  constructor(
    private readonly repo: WorkoutRepository,
    private readonly workoutTemplatesRepo: WorkoutTemplatesRepository,
    private readonly exerciseTemplatesRepo: ExerciseTemplatesRepository,
  ) {}

  async create(userId: string, data: WorkoutProps): Promise<Workout> {
    if (data.templateId) await this.checkIfTemplateExists(data.templateId);

    const id = uuid();
    const exerciseEntities = await this.mapExercisesToEntities(
      data.exercises,
      id,
    );
    return this.repo.create(
      new Workout(
        id,
        data.name,
        userId,
        exerciseEntities,
        null,
        new Date(),
        data.templateId,
      ),
    );
  }

  async recreateFromProps(
    workoutId: string,
    userId: string,
    data: WorkoutProps,
    finishedAt?: Date,
  ): Promise<Workout> {
    const exerciseEntities = await this.mapExercisesToEntities(
      data.exercises,
      workoutId,
    );
    return this.repo.create(
      new Workout(
        workoutId,
        data.name,
        userId,
        exerciseEntities,
        null,
        finishedAt,
        data.templateId,
      ),
    );
  }

  private async mapExercisesToEntities(
    exercises: ExerciseProps[],
    workoutId: string,
  ): Promise<Exercise[]> {
    const entities: Exercise[] = [];
    for (const exercise of exercises) {
      entities.push(
        exercise.id
          ? await this.createExerciseFromProps(workoutId, exercise)
          : await this.createExerciseFromTemplate(workoutId, exercise),
      );
    }
    return entities;
  }

  private mapSeriesToEntities(
    series: SeriesProps[],
    exerciseId: string,
  ): Series[] {
    return series.map(
      (series) =>
        new Series(series.id ?? uuid(), exerciseId, {
          repetitions: series.repetitions,
          weight: series.weight,
          seconds: series.seconds,
        }),
    );
  }

  private async createExerciseFromTemplate(
    workoutId: string,
    props: ExerciseProps,
  ): Promise<Exercise> {
    const template = await this.exerciseTemplatesRepo.findOneById(
      props.templateId,
    );
    const id = uuid();
    const series = this.mapSeriesToEntities(props.series, id);
    return new Exercise(
      id,
      workoutId,
      template.name,
      {
        hasRepetitions: template.options.hasRepetitions,
        hasWeight: template.options.hasWeight,
        hasTime: template.options.hasTime,
      },
      series,
      props.templateId,
    );
  }

  private async createExerciseFromProps(
    workoutId: string,
    props: ExerciseProps,
  ): Promise<Exercise> {
    const id = props.id;
    const series = this.mapSeriesToEntities(props.series, id);
    return new Exercise(
      id,
      workoutId,
      props.name,
      {
        hasRepetitions: props.hasRepetitions,
        hasWeight: props.hasWeight,
        hasTime: props.hasTime,
      },
      series,
      props.templateId,
    );
  }

  private async checkIfTemplateExists(id: string): Promise<void> {
    await this.workoutTemplatesRepo.findOneById(id);
  }
}
