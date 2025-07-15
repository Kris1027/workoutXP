'use client';

import { createWorkout, updateWorkout } from '@/actions/workout-actions';
import { createWorkoutSchema } from '@/schemas/data-schemas';
import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import { UploadButton } from '@/utils/uploadthing';
import { useForm } from '@tanstack/react-form';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface WorkoutFormProps {
  exercises: ExerciseProps[];
  isEditedWorkout?: WorkoutProps | null;
  currentUserId?: string;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ exercises, isEditedWorkout, currentUserId }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      id: isEditedWorkout?.id || '',
      name: isEditedWorkout?.name || '',
      imageUrl: isEditedWorkout?.imageUrl || '',
      description: isEditedWorkout?.description || '',
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
        setOpen(false);
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
        console.error('Error submitting form:', error);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <div>
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      field.handleChange(res[0].ufsUrl);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error('Upload failed:', error);
                    toast.error('Image upload failed. Please try again.');
                  }}
                />
                {field.state.value && (
                  <div className='mt-2'>
                    <Image
                      src={field.state.value}
                      alt='Workout'
                      width={100}
                      height={100}
                      className='object-cover object-center'
                    />
                  </div>
                )}
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
