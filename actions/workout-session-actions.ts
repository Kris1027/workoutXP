'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveWorkoutSession(
  workoutId: string,
  duration: number,
  exercisesCompleted: number,
  totalExercises: number
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('You must be logged in to save workout sessions');
    }

    // Validate input data
    if (duration < 1) {
      throw new Error('Workout duration must be at least 1 second');
    }
    
    if (exercisesCompleted < 0 || totalExercises < 1) {
      throw new Error('Invalid exercise count');
    }
    
    if (exercisesCompleted > totalExercises) {
      throw new Error('Completed exercises cannot exceed total exercises');
    }

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id,
        workoutId,
        duration,
        exercisesCompleted,
        totalExercises,
      },
    });

    revalidatePath('/');
    revalidatePath('/workouts');
    
    return { success: true, session: workoutSession };
  } catch (error) {
    console.error('Error saving workout session:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save workout session' 
    };
  }
}

export async function fetchUserWorkoutSessions(limit: number = 10) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return [];
    }

    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        workout: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: limit,
    });

    return workoutSessions;
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return [];
  }
}

export async function fetchLatestWorkoutSession() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return null;
    }

    const latestSession = await prisma.workoutSession.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        workout: {
          include: {
            user: true,
            exercises: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return latestSession;
  } catch (error) {
    console.error('Error fetching latest workout session:', error);
    return null;
  }
}