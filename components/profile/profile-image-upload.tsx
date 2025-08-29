'use client';

import { useState } from 'react';
import { updateProfileImage, deleteProfileImage } from '@/actions/profile-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getUserInitials } from '@/utils/get-user-initials';
import { UploadButton } from '@/utils/uploadthing';
import { Camera, Trash2, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  currentImage: string | null;
  userName: string | null;
  userId: string;
}

export default function ProfileImageUpload({
  currentImage,
  userName,
  userId,
}: ProfileImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageUpload = async (url: string) => {
    const result = await updateProfileImage(url);
    
    if (result.success) {
      toast.success('Profile image updated successfully');
      setIsOpen(false);
    } else {
      toast.error(result.error || 'Failed to update profile image');
    }
  };

  const handleImageDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProfileImage();
    
    if (result.success) {
      toast.success('Profile image removed successfully');
      setIsOpen(false);
    } else {
      toast.error(result.error || 'Failed to remove profile image');
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='relative group cursor-pointer'>
          <Avatar className='w-24 h-24 border-4 border-violet-400 shadow-lg transition-opacity group-hover:opacity-80'>
            {currentImage ? (
              <AvatarImage
                src={currentImage}
                alt={userName || 'User'}
                className='object-cover'
              />
            ) : null}
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold'>
              {userName ? (
                getUserInitials(userName)
              ) : (
                <User className='w-8 h-8' />
              )}
            </AvatarFallback>
          </Avatar>
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <div className='bg-black/60 rounded-full p-2'>
              <Camera className='w-5 h-5 text-white' />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture or remove the current one
          </DialogDescription>
        </DialogHeader>
        
        <div className='flex flex-col items-center gap-6 py-4'>
          <Avatar className='w-32 h-32 border-4 border-violet-400'>
            {currentImage ? (
              <AvatarImage
                src={currentImage}
                alt={userName || 'User'}
                className='object-cover'
              />
            ) : null}
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold'>
              {userName ? (
                getUserInitials(userName)
              ) : (
                <User className='w-12 h-12' />
              )}
            </AvatarFallback>
          </Avatar>
          
          <div className='flex flex-col gap-3 w-full'>
            <UploadButton
              endpoint='profileImage'
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setIsUploading(true);
                  // Construct the URL from the file key
                  const fileUrl = `https://utfs.io/f/${res[0].key}`;
                  handleImageUpload(fileUrl).finally(() => setIsUploading(false));
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              appearance={{
                button: 'w-full bg-primary hover:bg-primary/90 text-primary-foreground',
                container: 'w-full',
              }}
              content={{
                button({ ready }) {
                  if (isUploading) {
                    return (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Updating...
                      </>
                    );
                  }
                  if (ready) {
                    return (
                      <>
                        <Camera className='w-4 h-4 mr-2' />
                        Upload New Image
                      </>
                    );
                  }
                  return 'Getting ready...';
                },
                allowedContent({ ready, isUploading }) {
                  if (!ready) return 'Checking what you allow';
                  if (isUploading) return 'Uploading...';
                  return `Image files up to 4MB`;
                },
              }}
            />
            
            {currentImage && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant='destructive' 
                    className='w-full'
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className='w-4 h-4 mr-2' />
                        Remove Current Image
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your current profile picture. You can upload a new one anytime.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleImageDelete}>
                      Remove Image
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}