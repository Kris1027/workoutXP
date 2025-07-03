'use client';

import { createExercise, updateExercise } from '@/actions/exercises-action';
import { createExerciseSchema } from '@/schemas/data-schemas';
import type { ExerciseProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';

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
      imageUrl:
        'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin',
      description: isEditedExercise?.description || '',
    } as ExerciseProps,
    validators: {
      onChange: createExerciseSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditedExercise) {
        await updateExercise(value);
      } else {
        await createExercise(value);
      }
      if (handleEditComplete) {
        handleEditComplete();
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='p-4'
    >
      <h1>{isEditedExercise ? 'Update Exercise' : 'Create New Exercise'}</h1>

      {/* name */}
      <form.Field name='name'>
        {(field) => (
          <div>
            <label htmlFor='name'>Exercise Name:</label>
            <input
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
          <div>
            <label htmlFor='category'>Category:</label>
            <input
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
          <div>
            <label htmlFor='difficulty'>Difficulty:</label>
            <input
              type='text'
              id='difficulty'
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
            <label htmlFor='description'>Exercise description:</label>
            <input
              type='text'
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

      <button type='submit' className='py-2 px-10 bg-amber-700 cursor-pointer'>
        {isEditedExercise ? 'Update Exercise' : 'Create Exercise'}
      </button>
    </form>
  );
};

export default ExerciseCreateForm;
