'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createWorkout = async (formData: FormData) => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const imageUrl =
    (formData.get('imageUrl') as string) ||
    'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin';

  // Get selected exercise IDs
  const selectedExerciseIds = formData.getAll('exercises') as string[];

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
