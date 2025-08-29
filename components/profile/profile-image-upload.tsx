'use client';

import { useState, useRef } from 'react';
import { updateProfileImage } from '@/actions/profile-actions';
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
import { getUserInitials } from '@/utils/get-user-initials';
import { useUploadThing } from '@/utils/uploadthing';
import { Camera, User, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  currentImage: string | null;
  userName: string | null;
  userId: string;
}

export default function ProfileImageUpload({
  currentImage,
  userName,
}: ProfileImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { startUpload } = useUploadThing('profileImage', {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        const fileUrl = `https://utfs.io/f/${res[0].key}`;
        handleImageUpload(fileUrl);
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
      return;
    }
    
    setIsUploading(true);
    await startUpload([file]);
  };

  const handleImageUpload = async (url: string) => {
    const result = await updateProfileImage(url);
    
    if (result.success) {
      toast.success('Profile image updated successfully');
      setIsOpen(false);
    } else {
      toast.error(result.error || 'Failed to update profile image');
    }
    setIsUploading(false);
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
            {currentImage 
              ? 'Upload a new profile picture to replace the current one'
              : 'Upload your first profile picture'}
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
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
              disabled={isUploading}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className='w-full'
            >
              {isUploading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus className='w-4 h-4 mr-2' />
                  {currentImage ? 'Change Image' : 'Upload Image'}
                </>
              )}
            </Button>
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