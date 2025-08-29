'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/utils/uploadthing';
import { constructUploadThingUrl } from '@/utils/uploadthing-helpers';
import { deleteImageFromStorage } from '@/actions/image-actions';
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
  const [uploadedInSession, setUploadedInSession] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
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
    // If we uploaded this image in the current session and deleteOnRemove is true,
    // delete it from storage since it's not saved to database yet
    if (value && uploadedInSession === value && deleteOnRemove) {
      const result = await deleteImageFromStorage(value);
      if (!result.success) {
        console.error('Failed to delete image from storage:', result.error);
      }
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
            disabled={disabled}
            variant='outline'
            size='sm'
          >
            <X className='w-4 h-4 mr-2' />
            Remove
          </Button>
        )}
      </div>

      {preview && value && (
        <div className='relative inline-block'>
          <Image
            src={value}
            alt='Uploaded image'
            width={previewSize.width}
            height={previewSize.height}
            className='object-cover rounded-md border'
          />
        </div>
      )}
    </div>
  );
}