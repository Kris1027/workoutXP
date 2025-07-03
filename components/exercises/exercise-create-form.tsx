'use client';

import { createExercise } from '@/actions/exercises-action';
import { createExerciseSchema } from '@/schemas/data-schemas';
import type { ExerciseProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';

const ExerciseCreateForm = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      category: '',
      difficulty: '',
      imageUrl:
        'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin',
      description: '',
    } as ExerciseProps,
    validators: {
      onChange: createExerciseSchema,
    },
    onSubmit: async ({ value }) => {
      await createExercise(value);
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1>Create New Exercise</h1>

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
          Create Exercise
        </button>
      </form>
    </div>
  );
};

export default ExerciseCreateForm;
