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

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  try {
    await prisma.exercise.delete({
      where: {
        id: exerciseId,
      },
    });

    revalidatePath('/exercises');
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw new Error('Failed to delete exercise');
  }
};

export const updateExercise = async (exerciseData: ExerciseProps): Promise<void> => {
  const { name, category, difficulty, imageUrl, description, id } = exerciseData;

  try {
    await prisma.exercise.update({
      where: {
        id: id,
      },
      data: {
        name,
        category,
        difficulty,
        imageUrl,
        description,
      },
    });

    revalidatePath('/exercises');
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw new Error('Failed to update exercise');
  }
};
