'use server';

import prisma from '@/lib/prisma';
import type { ExerciseProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';

export const fetchExercises = async (): Promise<ExerciseProps[]> => {
  return prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createExercise = async (exerciseData: ExerciseProps): Promise<void> => {
  const { name, category, difficulty, imageUrl, description } = exerciseData;

  await prisma.exercise.create({
    data: {
      name,
      category,
      difficulty,
      imageUrl,
      description,
    },
  });

  revalidatePath('/exercises');
};
