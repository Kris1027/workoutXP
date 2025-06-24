'use server';

import prisma from '@/lib/prisma';
import type { WorkoutProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';

export const fetchWorkouts = async (): Promise<WorkoutProps[]> => {
  return prisma.workout.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      exercises: true,
    },
  });
};

export const fetchWorkoutById = async (id: string): Promise<WorkoutProps | null> => {
  return prisma.workout.findUnique({
    where: { id: id },
    include: {
      exercises: true,
    },
  });
};

export const createWorkout = async (formData: FormData): Promise<void> => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const DEFAULT_IMAGE_URL =
    'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin';
  const imageUrl = (formData.get('imageUrl') as string) || DEFAULT_IMAGE_URL;

  // Get selected exercise IDs
  const selectedExerciseIds = formData.getAll('exercises') as string[];

  // Create workout with selected exercises
  await prisma.workout.create({
    data: {
      name,
      description,
      imageUrl,
      exercises: {
        connect: selectedExerciseIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath('/workouts');
};
