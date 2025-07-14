import { z } from 'zod';

export const createExerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Exercise name is required'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Exercise description is required'),
});

export const createWorkoutSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Workout name is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Workout description is required'),
  exercises: z.array(createExerciseSchema).min(1, 'Exercises are required'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be less than 32 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z
      .string({ required_error: 'Please confirm your password' })
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
