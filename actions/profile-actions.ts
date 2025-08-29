'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

export async function updateProfileImage(imageUrl: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    // Get the current user to check if they have an existing image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // If user has an existing image, delete it from UploadThing storage
    if (currentUser?.image && currentUser.image.includes('utfs.io')) {
      try {
        // Extract the file key from the URL
        const fileKey = currentUser.image.split('/').pop();
        if (fileKey) {
          await utapi.deleteFiles([fileKey]);
        }
      } catch (deleteError) {
        console.error('Error deleting old image from storage:', deleteError);
        // Continue with update even if deletion fails
      }
    }

    // Update user with new image URL
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/'); // Also revalidate home page if profile is shown there
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating profile image:', error);
    return { success: false, error: 'Failed to update profile image' };
  }
}