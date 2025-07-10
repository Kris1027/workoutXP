'use server';

import { prisma } from '@/lib/prisma';
import type { UserProps } from '@/types/data-types';

export const fetchAllUsers = async (): Promise<UserProps[]> => {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};
