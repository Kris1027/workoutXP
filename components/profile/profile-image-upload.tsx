'use client';

import { useState } from 'react';
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
import ImageUpload from '@/components/ui/image-upload';
import { getUserInitials } from '@/utils/get-user-initials';
import { Camera, User } from 'lucide-react';
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
  const [tempImage, setTempImage] = useState(currentImage);

  const handleImageChange = async (url: string) => {
    const result = await updateProfileImage(url);
    
    if (result.success) {
      setTempImage(url);
      toast.success('Profile image updated successfully');
      setIsOpen(false);
    } else {
      toast.error(result.error || 'Failed to update profile image');
    }
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
            {tempImage ? (
              <AvatarImage
                src={tempImage}
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
          
          <div className='w-full'>
            <ImageUpload
              value={tempImage || ''}
              onChange={handleImageChange}
              endpoint='profileImage'
              preview={false}
              buttonText={tempImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
              className='flex justify-center'
            />
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