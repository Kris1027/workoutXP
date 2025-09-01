'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { utapi } from '@/server/uploadthings';
import type { ExerciseProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';

export const fetchExercises = async (): Promise<ExerciseProps[]> => {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    });
    
    return exercises.map(exercise => ({
      ...exercise,
      instructions: exercise.instructions ?? undefined,
      userId: exercise.userId ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching exercises', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const fetchExerciseById = async (id: string): Promise<ExerciseProps | null> => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    
    if (!exercise) return null;
    
    return {
      ...exercise,
      instructions: exercise.instructions ?? undefined,
      userId: exercise.userId ?? undefined,
    };
  } catch (error) {
    console.error('Error fetching exercise by id', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const fetchExercisesByUserId = async (userId: string): Promise<ExerciseProps[]> => {
  if (!userId) throw new Error('User ID is required to fetch exercises');

  try {
    const exercises = await prisma.exercise.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    });

    return exercises.map(exercise => ({
      ...exercise,
      instructions: exercise.instructions ?? undefined,
      userId: exercise.userId ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching exercises by user ID', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const createExercise = async (exerciseData: Omit<ExerciseProps, 'userId'>): Promise<void> => {
  const { name, category, difficulty, imageUrl, description, instructions } = exerciseData;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    await prisma.exercise.create({
      data: {
        name,
        category,
        difficulty,
        imageUrl,
        description,
        instructions,
        userId,
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

  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.isAdmin;

  try {
    // Check if any workout is using this exercise
    const workoutsUsingExercise = await prisma.workout.count({
      where: {
        exercises: {
          some: { id: exerciseId },
        },
      },
    });

    if (workoutsUsingExercise) {
      throw new Error('Cannot delete exercise: it is used in at least one workout.');
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new Error('Exercise not found');
    if (exercise.userId !== currentUserId && !isAdmin)
      throw new Error('User not authorized to delete this exercise');

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
  const { name, category, difficulty, imageUrl, description, instructions, id, userId } = exerciseData;

  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.isAdmin;

  if (!id) throw new Error('Missing ID for exercise update');
  if (!currentUserId) throw new Error('User not authenticated');

  try {
    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) throw new Error('Exercise not found');
    if (existingExercise.userId !== currentUserId && !isAdmin)
      throw new Error('User not authorized to update this exercise');

    // Delete the old image from storage if:
    // 1. The imageUrl is being changed to a different URL
    // 2. The imageUrl is being removed (set to empty string)
    if (existingExercise.imageUrl && existingExercise.imageUrl !== imageUrl) {
      try {
        const url = new URL(existingExercise.imageUrl);
        const fileKey = url.pathname.split('/').pop();
        if (fileKey) {
          await deleteFileFromUploadThing(fileKey);
        }
      } catch (error) {
        console.error('Invalid old image URL:', existingExercise.imageUrl, error);
        // Continue with update even if deletion fails
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
        instructions,
      },
    });

    revalidatePath('/exercises');
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};
