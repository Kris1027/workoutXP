'use client';

import { createExercise, updateExercise } from '@/actions/exercise-actions';
import { createExerciseSchema } from '@/schemas/data-schemas';
import type { ExerciseProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';
import ImageUpload from '@/components/ui/image-upload';
import { deleteImageFromStorage } from '@/actions/image-actions';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

interface ExerciseFormProps {
  isEditedExercise?: ExerciseProps | null;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ isEditedExercise }) => {
  const [open, setOpen] = useState(false);
  const uploadedImageRef = useRef<string | null>(null);
  const initialImageUrl = isEditedExercise?.imageUrl || '';
  
  const form = useForm({
    defaultValues: {
      id: isEditedExercise?.id || '',
      name: isEditedExercise?.name || '',
      category: isEditedExercise?.category || '',
      difficulty: isEditedExercise?.difficulty || '',
      imageUrl: initialImageUrl,
      description: isEditedExercise?.description || '',
    } as ExerciseProps,
    validators: {
      onSubmit: createExerciseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditedExercise) {
          await updateExercise(value);
          toast.success('Exercise updated successfully!');
        } else {
          await createExercise(value);
          toast.success('Exercise created successfully!');
          form.reset();
        }
        uploadedImageRef.current = null; // Clear the ref after successful submit
        setOpen(false);
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
        console.error('Error submitting form:', error);
      }
    },
  });

  const handleOpenChange = async (newOpen: boolean) => {
    // If closing the modal without saving
    if (!newOpen && !isEditedExercise) {
      const currentImageUrl = form.state.values.imageUrl;
      
      // If there's an uploaded image that wasn't saved, delete it
      if (currentImageUrl && uploadedImageRef.current === currentImageUrl) {
        const deleteResult = await deleteImageFromStorage(currentImageUrl);
        if (!deleteResult.success) {
          console.error('Failed to delete orphaned image:', deleteResult.error || 'Unknown error');
        }
      }
      
      // Reset the form
      form.reset();
      uploadedImageRef.current = null;
    }
    
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer'>
          {isEditedExercise ? 'Edit Exercise' : 'Create New Exercise'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className='p-4 flex flex-col justify-center gap-2'
        >
          <DialogTitle>{isEditedExercise ? 'Update Exercise' : 'Create New Exercise'}</DialogTitle>
          <DialogDescription>
            {isEditedExercise
              ? 'Edit the fields to update your exercise.'
              : 'Complete the fields to create a new exercise.'}
          </DialogDescription>

          {/* image */}
          <form.Field name='imageUrl'>
            {(field) => (
              <div className='space-y-2'>
                <Label>Exercise Image:</Label>
                <ImageUpload
                  value={field.state.value}
                  onChange={(url) => {
                    field.handleChange(url);
                    // Track newly uploaded images for cleanup if modal closes
                    if (!isEditedExercise) {
                      uploadedImageRef.current = url;
                    }
                  }}
                  endpoint='imageUploader'
                  buttonText={field.state.value ? 'Change Image' : 'Upload Image'}
                  showRemoveButton={true}
                  onRemove={() => {
                    field.handleChange('');
                    // Clear the ref when user manually removes
                    if (!isEditedExercise) {
                      uploadedImageRef.current = null;
                    }
                  }}
                  deleteOnRemove={!isEditedExercise} // Only delete from storage for new exercises
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* name */}
          <form.Field name='name'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='name'>Exercise Name:</Label>
                <Input
                  type='text'
                  id='name'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* category */}
          <form.Field name='category'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='category'>Category:</Label>
                <Input
                  type='text'
                  id='category'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* difficulty */}
          <form.Field name='difficulty'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='difficulty'>Difficulty:</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger id='difficulty'>
                    <SelectValue placeholder='Select difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Beginner'>Beginner</SelectItem>
                    <SelectItem value='Intermediate'>Intermediate</SelectItem>
                    <SelectItem value='Advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* description */}
          <form.Field name='description'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='description'>Exercise description:</Label>
                <Textarea
                  id='description'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <Button type='submit'>{isEditedExercise ? 'Update Exercise' : 'Create Exercise'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseForm;
