export type ExerciseProps = {
  id?: string;
  name: string;
  category: string;
  difficulty: string;
  imageUrl: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type WorkoutProps = {
  id?: string;
  name: string;
  imageUrl: string;
  description: string;
  exercises: ExerciseProps[];
  createdAt?: Date;
  updatedAt?: Date;
};
