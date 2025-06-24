'use server';

import prisma from '@/lib/prisma';
import type { ExerciseProps } from '@/types/data-types';

export const fetchExercises = async (): Promise<ExerciseProps[]> => {
  return prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
  });
};
