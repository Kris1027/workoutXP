'use server';

import { UTApi } from 'uploadthing/server';
import { auth } from '@/auth';

const utapi = new UTApi();

export async function deleteImageFromStorage(imageUrl: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  if (!imageUrl || !imageUrl.includes('utfs.io')) {
    return { success: false, error: 'Invalid image URL' };
  }

  try {
    // Extract the file key from the URL
    const fileKey = imageUrl.split('/').pop();
    if (fileKey) {
      await utapi.deleteFiles([fileKey]);
      console.log('Deleted image from storage:', fileKey);
      return { success: true };
    }
    return { success: false, error: 'Could not extract file key' };
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return { success: false, error: 'Failed to delete image from storage' };
  }
}