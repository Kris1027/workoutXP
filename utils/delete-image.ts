import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

export async function deleteImageFromStorage(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.includes('utfs.io')) {
    return false;
  }

  try {
    // Extract the file key from the URL
    const fileKey = imageUrl.split('/').pop();
    if (fileKey) {
      await utapi.deleteFiles([fileKey]);
      console.log('Deleted image from storage:', fileKey);
      return true;
    }
  } catch (error) {
    console.error('Error deleting image from storage:', error);
  }
  
  return false;
}