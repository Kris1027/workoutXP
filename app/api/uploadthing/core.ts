import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/auth';
import { constructUploadThingUrl } from '@/utils/uploadthing-helpers';
import { UPLOAD_CONFIG } from '@/utils/upload-constants';

const f = createUploadthing();

// Image upload configuration for UploadThing
const IMAGE_CONFIG = {
  maxFileSize: UPLOAD_CONFIG.IMAGE.MAX_FILE_SIZE_STRING,
  maxFileCount: UPLOAD_CONFIG.IMAGE.MAX_FILE_COUNT,
} as const;

export const ourFileRouter = {
  profileImage: f({
    image: IMAGE_CONFIG,
  })
    .middleware(async () => {
      const session = await auth();
      
      if (!session?.user?.id) {
        throw new Error('Unauthorized');
      }
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = constructUploadThingUrl(file.key);
      return { uploadedBy: metadata.userId, url: fileUrl };
    }),
  
  imageUploader: f({
    image: IMAGE_CONFIG,
  })
    .middleware(async () => {
      const session = await auth();
      
      if (!session?.user?.id) {
        throw new Error('Unauthorized');
      }
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = constructUploadThingUrl(file.key);
      return { uploadedBy: metadata.userId, url: fileUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
