import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/auth';
import { constructUploadThingUrl } from '@/utils/uploadthing-helpers';

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
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
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
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
