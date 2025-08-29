/**
 * Constructs a full UploadThing file URL from a file key
 * @param fileKey - The file key returned from UploadThing
 * @returns The complete file URL
 */
export const constructUploadThingUrl = (fileKey: string): string => {
  return `https://utfs.io/f/${fileKey}`;
};

/**
 * Extracts the file key from an UploadThing URL
 * @param url - The full UploadThing URL
 * @returns The file key or null if invalid URL
 */
export const extractFileKeyFromUrl = (url: string): string | null => {
  if (!url || !url.includes('utfs.io')) {
    return null;
  }
  
  // Remove trailing slashes and extract the file key
  const sanitizedUrl = url.replace(/\/+$/, '');
  const fileKey = sanitizedUrl.split('/').pop();
  
  // Return null if fileKey is empty or undefined
  return fileKey && fileKey.length > 0 ? fileKey : null;
};