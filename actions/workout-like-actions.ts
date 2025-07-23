'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export const toggleWorkoutLike = async (workoutId: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  if (!workoutId) {
    throw new Error('Workout ID is required');
  }

  try {
    // Check if the user has already liked this workout
    const existingLike = await prisma.workoutLike.findUnique({
      where: {
        userId_workoutId: {
          userId,
          workoutId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.workoutLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like: Create a new like
      await prisma.workoutLike.create({
        data: {
          userId,
          workoutId,
        },
      });
    }

    // Get updated like count
    const likeCount = await prisma.workoutLike.count({
      where: {
        workoutId,
      },
    });

    revalidatePath('/workouts');
    revalidatePath(`/workouts/${workoutId}`);

    return {
      isLiked: !existingLike,
      likeCount,
    };
  } catch (error) {
    console.error('Error toggling workout like:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const getWorkoutLikeStatus = async (workoutId: string, userId?: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  try {
    const likeCount = await prisma.workoutLike.count({
      where: {
        workoutId,
      },
    });

    let isLiked = false;
    if (userId) {
      const existingLike = await prisma.workoutLike.findUnique({
        where: {
          userId_workoutId: {
            userId,
            workoutId,
          },
        },
      });
      isLiked = !!existingLike;
    }

    return {
      isLiked,
      likeCount,
    };
  } catch (error) {
    console.error('Error getting workout like status:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};

export const getWorkoutLikes = async (workoutId: string) => {
  try {
    return await prisma.workoutLike.findMany({
      where: {
        workoutId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching workout likes:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};