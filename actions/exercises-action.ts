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
    throw new Error('Failed to delete file from UploadThing');
  }
};

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  if (!exerciseId) throw new Error('Missing ID for exercise deletion');

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new Error('Exercise not found');

    try {
      const url = new URL(exercise.imageUrl);
      const fileKey = url.pathname.split('/').pop();
      if (fileKey) {
        await deleteFileFromUploadThing(fileKey);
      }
    } catch (error) {
      console.error('Invalid image URL:', exercise.imageUrl, error);
      throw new Error(error instanceof Error ? error.message : 'Unexpected error');
    }

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
    // Delete the old image from storage if the imageUrl is being updated
    if (imageUrl) {
      const existingExercise = await prisma.exercise.findUnique({
        where: { id },
      });

      if (existingExercise?.imageUrl && existingExercise.imageUrl !== imageUrl) {
        try {
          const url = new URL(existingExercise.imageUrl);
          const fileKey = url.pathname.split('/').pop();
          if (fileKey) {
            await deleteFileFromUploadThing(fileKey);
          }
        } catch (error) {
          console.error('Invalid old image URL:', existingExercise.imageUrl, error);
          throw new Error(error instanceof Error ? error.message : 'Unexpected error');
        }
      }
    }

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
