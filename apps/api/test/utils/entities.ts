export namespace E2EEntities {
  export interface AppUser {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }

  export interface ExerciseTemplate {
    id: string;
    name: string;
    createdById: string;
    hasRepetitions: boolean;
    hasWeight: boolean;
    hasTime: boolean;
  }

  export interface Series {
    id: string;
    repetitions?: number;
    weight?: number;
    seconds?: number;
  }

  export interface NewSeries {
    repetitions?: number;
    weight?: number;
    seconds?: number;
  }

  export interface Exercise {
    id: string;
    series: Series;
    hasRepetitions: boolean;
    hasWeight: boolean;
    hasTime: boolean;
  }

  export interface NewExercise {
    templateId: string;
    series: NewSeries;
  }

  export interface Workout {
    id: string;
    createdById: string;
    exercises: Exercise[];
    templateId?: string;
    finishedAt?: Date;
  }

  export interface NewWorkout {
    name: string;
    templateId?: string;
    exercises: NewExercise[];
  }
}
