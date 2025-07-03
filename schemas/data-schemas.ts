import { z } from 'zod';

export const createExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Exercise description is required'),
});

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Workout description is required'),
  exercises: z.array(createExerciseSchema),
});
