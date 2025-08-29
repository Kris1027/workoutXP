/**
 * Shared constants for file upload configuration
 */

export const UPLOAD_CONFIG = {
  IMAGE: {
    MAX_FILE_SIZE_MB: 4,
    MAX_FILE_SIZE_BYTES: 4 * 1024 * 1024, // 4MB in bytes
    MAX_FILE_SIZE_STRING: '4MB' as const, // For UploadThing config
    MAX_FILE_COUNT: 1,
    ACCEPTED_TYPES: ['image/*'],
    ACCEPTED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
} as const;