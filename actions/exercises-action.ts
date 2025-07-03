'use server';

import prisma from '@/lib/prisma';
import type { ExerciseProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';

export const fetchExercises = async (): Promise<ExerciseProps[]> => {
  try {
    return await prisma.exercise.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching exercises', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const createExercise = async (exerciseData: ExerciseProps): Promise<void> => {
  const { name, category, difficulty, imageUrl, description } = exerciseData;

  try {
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
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  if (!exerciseId) throw new Error('Missing ID for exercise deletion');

  try {
    await prisma.exercise.delete({
      where: {
        id: exerciseId,
      },
    });

    revalidatePath('/exercises');
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const updateExercise = async (exerciseData: ExerciseProps): Promise<void> => {
  const { name, category, difficulty, imageUrl, description, id } = exerciseData;

  if (!id) throw new Error('Missing ID for exercise update');

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
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};
