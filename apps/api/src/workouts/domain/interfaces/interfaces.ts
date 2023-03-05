export interface SeriesProps {
  id?: string;
  repetitions?: number;
  weight?: number;
  seconds?: number;
}

export interface ExerciseProps {
  id?: string;
  name?: string;
  hasRepetitions?: boolean;
  hasWeight?: boolean;
  hasTime?: boolean;
  templateId?: string;
  series: SeriesProps[];
}

export interface WorkoutProps {
  name: string;
  templateId?: string;
  exercises: ExerciseProps[];
}
