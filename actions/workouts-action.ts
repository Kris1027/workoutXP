'use server';

import prisma from '@/lib/prisma';
import type { WorkoutProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';
import { utapi } from '@/server/uploadthings';

export const fetchWorkouts = async (): Promise<WorkoutProps[]> => {
  try {
    return await prisma.workout.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: true,
      },
    });
  } catch (error) {
    console.error('Error fetching workouts', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const fetchWorkoutById = async (id: string): Promise<WorkoutProps | null> => {
  try {
    return await prisma.workout.findUnique({
      where: { id: id },
      include: {
        exercises: true,
      },
    });
  } catch (error) {
    console.error('Error fetching workout', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const createWorkout = async (workoutData: WorkoutProps): Promise<void> => {
  const { name, description, imageUrl, exercises } = workoutData;

  const selectedExerciseIds = exercises.map((exercise) => exercise.id);

  try {
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
  } catch (error) {
    console.error('Error creating workout:', error);
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

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  if (!workoutId) throw new Error('Missing ID for workout deletion');

  try {
    // Fetch the workout to get the image URL
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) throw new Error('Workout not found');

    // Extract the file key from the image URL (if applicable)
    if (workout.imageUrl) {
      const fileKey = workout.imageUrl.split('/').pop(); // Adjust this logic based on your URL structure
      if (fileKey) {
        await deleteFileFromUploadThing(fileKey);
      }
    }

    // Delete the workout from the database
    await prisma.workout.delete({
      where: {
        id: workoutId,
      },
    });

    revalidatePath('/workouts');
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const updateWorkout = async (workoutData: WorkoutProps): Promise<void> => {
  const { name, description, imageUrl, exercises, id } = workoutData;

  if (!id) throw new Error('Missing ID for workout update');

  const selectedExerciseIds = exercises.map((exercise) => exercise.id);

  try {
    await prisma.workout.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        imageUrl,
        exercises: {
          set: selectedExerciseIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath('/workouts');
  } catch (error) {
    console.error('Error updating workout:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};
