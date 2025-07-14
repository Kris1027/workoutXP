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

export const fetchUserById = async (id: string): Promise<UserProps | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error(error instanceof Error ? error.message : 'Unexpected error');
  }
};
