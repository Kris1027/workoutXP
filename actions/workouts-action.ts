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

export const createWorkout = async (workoutData: WorkoutProps): Promise<void> => {
  const { name, description, imageUrl, exercises } = workoutData;

  // Get selected exercise IDs
  const selectedExerciseIds = exercises.map((exercise) => exercise.id);

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
    throw new Error('Failed to delete exercise');
  }
};
