'use server';

import prisma from '@/lib/prisma';
import { utapi } from '@/server/uploadthings';
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

const deleteFileFromUploadThing = async (fileKey: string | string[]) => {
  try {
    await utapi.deleteFiles(fileKey);
  } catch (error) {
    throw new Error('Failed to delete file(s) from UploadThing');
  }
};

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  if (!exerciseId) throw new Error('Missing ID for exercise deletion');

  try {
    // Fetch the exercise to get the image URL
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new Error('Exercise not found');

    // Extract the file key from the image URL (if applicable)
    if (exercise.imageUrl) {
      const fileKey = exercise.imageUrl.split('/').pop(); // Adjust this logic based on your URL structure
      if (fileKey) {
        await deleteFileFromUploadThing(fileKey);
      }
    }

    // Delete the exercise from the database
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
