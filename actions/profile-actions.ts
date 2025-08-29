'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileImage(imageUrl: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    revalidatePath('/profile');
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating profile image:', error);
    return { success: false, error: 'Failed to update profile image' };
  }
}

export async function deleteProfileImage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: null,
      },
    });

    revalidatePath('/profile');
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return { success: false, error: 'Failed to delete profile image' };
  }
}