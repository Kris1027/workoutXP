'use server';

import { UTApi } from 'uploadthing/server';
import { auth } from '@/auth';
import { extractFileKeyFromUrl } from '@/utils/uploadthing-helpers';

const utapi = new UTApi();

export async function deleteImageFromStorage(imageUrl: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  if (!imageUrl || !imageUrl.includes('utfs.io')) {
    return { success: false, error: 'Invalid image URL' };
  }

  const fileKey = extractFileKeyFromUrl(imageUrl);
  if (!fileKey) {
    return { success: false, error: 'Could not extract file key from URL' };
  }

  try {
    await utapi.deleteFiles([fileKey]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return { success: false, error: 'Failed to delete image from storage' };
  }
}