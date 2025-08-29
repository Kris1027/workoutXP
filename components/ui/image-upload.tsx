'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/utils/uploadthing';
import { constructUploadThingUrl } from '@/utils/uploadthing-helpers';
import { deleteImageFromStorage } from '@/actions/image-actions';
import { UPLOAD_CONFIG } from '@/utils/upload-constants';
import { Loader2, Upload, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  endpoint?: 'profileImage' | 'imageUploader';
  className?: string;
  preview?: boolean;
  previewSize?: { width: number; height: number };
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  showRemoveButton?: boolean;
  disabled?: boolean;
  deleteOnRemove?: boolean; // Whether to delete from storage when removing
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  endpoint = 'imageUploader',
  className,
  preview = true,
  previewSize = { width: 100, height: 100 },
  buttonText,
  buttonVariant = 'default',
  showRemoveButton = false,
  disabled = false,
  deleteOnRemove = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadedInSession, setUploadedInSession] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine if image should be deleted from storage
  const shouldDeleteFromStorage = (): boolean => {
    // Delete only if:
    // 1. There's a value (image URL exists)
    // 2. This image was uploaded in current session (not from DB)
    // 3. deleteOnRemove flag is true (for new items, not edits)
    return Boolean(value && uploadedInSession === value && deleteOnRemove);
  };

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        const fileUrl = constructUploadThingUrl(res[0].key);
        onChange(fileUrl);
        setUploadedInSession(fileUrl); // Track that we uploaded this in current session
        setIsUploading(false);
        toast.success('Image uploaded successfully');
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

    // Validate file size
    if (file.size > UPLOAD_CONFIG.IMAGE.MAX_FILE_SIZE_BYTES) {
      toast.error(`File size must be less than ${UPLOAD_CONFIG.IMAGE.MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setIsUploading(true);
    await startUpload([file]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    // Delete from storage if this is a newly uploaded image
    if (shouldDeleteFromStorage()) {
      setIsDeleting(true);
      const result = await deleteImageFromStorage(value!); // Safe to assert - shouldDeleteFromStorage checks value exists
      setIsDeleting(false);
      
      if (!result.success) {
        console.error('Failed to delete image from storage:', result.error);
        toast.error('Failed to remove image from storage. Please try again.');
        // Don't clear the image from UI if deletion failed
        return;
      }
      
      toast.success('Image removed successfully');
    }
    
    // Clear the uploaded in session tracker
    setUploadedInSession(null);
    
    // Call the provided onRemove or clear the value
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isUploading) return 'Uploading...';
    return value ? 'Change Image' : 'Upload Image';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center gap-2'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
          disabled={disabled || isUploading}
        />
        <Button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          variant={buttonVariant}
          size='sm'
        >
          {isUploading ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Uploading...
            </>
          ) : (
            <>
              {value ? <ImagePlus className='w-4 h-4 mr-2' /> : <Upload className='w-4 h-4 mr-2' />}
              {getButtonText()}
            </>
          )}
        </Button>
        
        {showRemoveButton && value && !isUploading && (
          <Button
            type='button'
            onClick={handleRemove}
            disabled={disabled || isDeleting}
            variant='outline'
            size='sm'
          >
            {isDeleting ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Removing...
              </>
            ) : (
              <>
                <X className='w-4 h-4 mr-2' />
                Remove
              </>
            )}
          </Button>
        )}
      </div>

      {preview && value && (
        <div className='relative inline-block'>
          {isImageLoading && (
            <div 
              className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-md border border-gray-200 dark:border-gray-700 backdrop-blur-sm'
              style={{ width: previewSize.width, height: previewSize.height }}
            >
              <div className='relative'>
                {/* Animated pulse ring */}
                <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-md opacity-30 animate-pulse' />
                
                {/* Spinner */}
                <div className='relative bg-white dark:bg-gray-800 p-2 rounded-full shadow-md'>
                  <Loader2 className='w-5 h-5 animate-spin text-blue-500 dark:text-blue-400' strokeWidth={2.5} />
                </div>
              </div>
            </div>
          )}
          <Image
            src={value}
            alt='Uploaded image'
            width={previewSize.width}
            height={previewSize.height}
            className='object-cover rounded-md border'
            onLoadingComplete={() => setIsImageLoading(false)}
            onLoadStart={() => setIsImageLoading(true)}
          />
        </div>
      )}
    </div>
  );
}