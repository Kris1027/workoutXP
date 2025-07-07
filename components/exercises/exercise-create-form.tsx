'use client';

import { createExercise, updateExercise } from '@/actions/exercises-action';
import { createExerciseSchema } from '@/schemas/data-schemas';
import type { ExerciseProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';
import { UploadButton } from '@/utils/uploadthing';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ExerciseCreateFormProps {
  isEditedExercise?: ExerciseProps | null;
  handleEditComplete?: () => void;
}

const ExerciseCreateForm: React.FC<ExerciseCreateFormProps> = ({
  isEditedExercise,
  handleEditComplete,
}) => {
  const form = useForm({
    defaultValues: {
      id: isEditedExercise?.id || '',
      name: isEditedExercise?.name || '',
      category: isEditedExercise?.category || '',
      difficulty: isEditedExercise?.difficulty || '',
      imageUrl: isEditedExercise?.imageUrl || '',
      description: isEditedExercise?.description || '',
    } as ExerciseProps,
    validators: {
      onSubmit: createExerciseSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditedExercise) {
        await updateExercise(value);
        form.reset();
      } else {
        await createExercise(value);
        form.reset();
      }
      if (handleEditComplete) {
        handleEditComplete();
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Exercise</Button>
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

          {/* image */}
          <form.Field name='imageUrl'>
            {(field) => (
              <div className='space-y-2'>
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      field.handleChange(res[0].ufsUrl);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error(`Error! ${error.message}`); // let's replace this with toast later
                  }}
                />
                {field.state.value && (
                  <div className='mt-2'>
                    <Image
                      src={field.state.value}
                      alt='Exercise'
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

export default ExerciseCreateForm;
