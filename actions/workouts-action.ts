'use server';

import prisma from '@/lib/prisma';
import type { WorkoutProps } from '@/types/data-types';
import { revalidatePath } from 'next/cache';

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

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  try {
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
