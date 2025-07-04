import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const auth = 'fakeUser';

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async () => {
    return { uploadedBy: auth };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
