type ExerciseCategory = 'Chest' | 'Shoulders';
type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ExerciseProps = {
  id?: string;
  name: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  ImageUrl: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};
