import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

export async function deleteImageFromStorage(imageUrl: string | null | undefined): Promise<{ success: boolean; error?: string }> {
  if (!imageUrl || !imageUrl.includes('utfs.io')) {
    return { success: false, error: 'Invalid or missing image URL' };
  }

  try {
    // Extract the file key from the URL
    const fileKey = imageUrl.split('/').pop();
    if (fileKey) {
      await utapi.deleteFiles([fileKey]);
      console.log('Deleted image from storage:', fileKey);
      return { success: true };
    }
    return { success: false, error: 'Could not extract file key from URL' };
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete image from storage' 
    };
  }
}