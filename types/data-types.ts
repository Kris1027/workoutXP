import { signInSchema, signUpSchema } from '@/schemas/data-schemas';
import { z } from 'zod';

export type UserProps = {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

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
  userId?: string;
  user?: UserProps;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SignInProps = z.infer<typeof signInSchema>;

export type SignUpProps = z.infer<typeof signUpSchema>;
