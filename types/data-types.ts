export type ExerciseProps = {
  id?: string;
  name: string;
  category: string;
  difficulty: string;
  ImageUrl: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type WorkoutProps = {
  id?: string;
  name: string;
  description: string;
  exercises?: ExerciseProps[];
  createdAt?: Date;
  updatedAt?: Date;
};
