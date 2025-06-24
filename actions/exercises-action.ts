'use server';

import prisma from '@/lib/prisma';

export const fetchExercises = async () => {
  return prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
  });
};
