'use server';

import { PrismaClient } from '@/app/generated/prisma';

export async function getExercises() {
  const prisma = new PrismaClient();

  const data = await prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return data;
}
