'use client';

import { createWorkout, updateWorkout } from '@/actions/workout-actions';
import { createWorkoutSchema } from '@/schemas/data-schemas';
import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import ImageUpload from '@/components/ui/image-upload';
import { deleteImageFromStorage } from '@/actions/image-actions';
import { useForm } from '@tanstack/react-form';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WorkoutFormProps {
  exercises: ExerciseProps[];
  isEditedWorkout?: WorkoutProps | null;
  currentUserId?: string;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ exercises, isEditedWorkout, currentUserId }) => {
  const [open, setOpen] = useState(false);
  const uploadedImageRef = useRef<string | null>(null);
  const initialImageUrl = isEditedWorkout?.imageUrl || '';
  
  const form = useForm({
    defaultValues: {
      id: isEditedWorkout?.id || '',
      name: isEditedWorkout?.name || '',
      imageUrl: initialImageUrl,
      description: isEditedWorkout?.description || '',
      difficulty: isEditedWorkout?.difficulty || 'Beginner',
      exercises: isEditedWorkout?.exercises || ([] as ExerciseProps[]),
      userId: isEditedWorkout?.userId || currentUserId,
    } as WorkoutProps,
    validators: {
      onSubmit: createWorkoutSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditedWorkout) {
          await updateWorkout(value);
          toast.success('Workout updated successfully!');
        } else {
          await createWorkout(value);
          toast.success('Workout created successfully!');
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
    if (!newOpen && !isEditedWorkout) {
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
          {isEditedWorkout ? 'Edit Workout' : 'Create New Workout'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{isEditedWorkout ? 'Update Workout' : 'Create New Workout'}</DialogTitle>
        <DialogDescription>
          {isEditedWorkout
            ? 'Edit the fields to update your workout.'
            : 'Complete the fields to create a new workout.'}
        </DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className='p-4 flex flex-col justify-center gap-2'
        >
          {/* image */}
          <form.Field name='imageUrl'>
            {(field) => (
              <div className='space-y-2'>
                <Label>Workout Image:</Label>
                <ImageUpload
                  value={field.state.value}
                  onChange={(url) => {
                    field.handleChange(url);
                    // Track newly uploaded images for cleanup if modal closes
                    if (!isEditedWorkout) {
                      uploadedImageRef.current = url;
                    }
                  }}
                  endpoint='imageUploader'
                  buttonText={field.state.value ? 'Change Image' : 'Upload Image'}
                  showRemoveButton={true}
                  onRemove={() => {
                    field.handleChange('');
                    // Clear the ref when user manually removes
                    if (!isEditedWorkout) {
                      uploadedImageRef.current = null;
                    }
                  }}
                  deleteOnRemove={!isEditedWorkout} // Only delete from storage for new workouts
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
              <div>
                <Label htmlFor='name'>Workout name:</Label>
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

          {/* description */}
          <form.Field name='description'>
            {(field) => (
              <div>
                <Label htmlFor='description'>Workout description:</Label>
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

          {/* difficulty */}
          <form.Field name='difficulty'>
            {(field) => (
              <div>
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

          {/* exercises */}
          <form.Field name='exercises'>
            {(field) => (
              <div>
                <Label>Select Exercises:</Label>
                <ul>
                  {exercises &&
                    exercises.map((exercise) => (
                      <li key={exercise.id} className='flex items-center space-x-2'>
                        <Checkbox
                          checked={field.state.value.some((ex) => ex.id === exercise.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.handleChange([...field.state.value, exercise]);
                            } else {
                              field.handleChange([
                                ...field.state.value.filter((ex) => ex.id !== exercise.id),
                              ]);
                            }
                          }}
                        />
                        <p>{exercise.name}</p>
                      </li>
                    ))}
                </ul>
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

          <Button type='submit'>{isEditedWorkout ? 'Update Workout' : 'Create Workout'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutForm;
