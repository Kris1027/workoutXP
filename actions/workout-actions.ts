'use server';

import { prisma } from '@/lib/prisma';
import type { WorkoutProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';
import { utapi } from '@/server/uploadthings';
import { auth } from '@/auth';

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

export const fetchWorkoutsByUserId = async (userId: string): Promise<WorkoutProps[]> => {
  if (!userId) throw new Error('User ID is required to fetch workouts');

  try {
    return await prisma.workout.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: true,
      },
    });
  } catch (error) {
    console.error('Error fetching workouts by user ID', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const createWorkout = async (workoutData: Omit<WorkoutProps, 'userId'>): Promise<void> => {
  const { name, description, imageUrl, exercises } = workoutData;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const selectedExerciseIds = exercises.map((exercise) => ({ id: exercise.id }));

  try {
    await prisma.workout.create({
      data: {
        name,
        description,
        imageUrl,
        userId,
        exercises: {
          connect: selectedExerciseIds,
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
    throw new Error('Failed to delete file from UploadThing');
  }
};

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  if (!workoutId) throw new Error('Missing ID for workout deletion');

  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.isAdmin;

  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) throw new Error('Workout not found');
    if (workout.userId !== currentUserId && !isAdmin)
      throw new Error('User not authorized to delete this workout');

    try {
      const url = new URL(workout.imageUrl);
      const fileKey = url.pathname.split('/').pop();
      if (fileKey) {
        await deleteFileFromUploadThing(fileKey);
      }
    } catch (error) {
      console.error('Invalid image URL:', workout.imageUrl, error);
      throw new Error(error instanceof Error ? error.message : 'Unexpected error');
    }

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
  const { name, description, imageUrl, exercises, id, userId } = workoutData;

  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.isAdmin;

  if (!id) throw new Error('Missing ID for workout update');
  if (!userId) throw new Error('User not authenticated');
  if (currentUserId !== userId && !isAdmin)
    throw new Error('User not authorized to update this workout');

  const selectedExerciseIds = exercises.map((exercise) => exercise.id);

  try {
    // Delete the old image from storage if the imageUrl is being updated
    if (imageUrl) {
      const existingWorkout = await prisma.workout.findUnique({
        where: { id },
      });

      if (existingWorkout?.imageUrl && existingWorkout.imageUrl !== imageUrl) {
        try {
          const url = new URL(existingWorkout.imageUrl);
          const fileKey = url.pathname.split('/').pop();
          if (fileKey) {
            await deleteFileFromUploadThing(fileKey);
          }
        } catch (error) {
          console.error('Invalid old image URL:', existingWorkout.imageUrl, error);
          throw new Error(error instanceof Error ? error.message : 'Unexpected error');
        }
      }
    }

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
