'use client';

import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';

interface WorkoutCreateFormTanstackProps {
  exercises: ExerciseProps[];
}

const WorkoutCreateFormTanstack: React.FC<WorkoutCreateFormTanstackProps> = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      imageUrl:
        'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin',
      description: '',
      exercises: [],
    } as WorkoutProps,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
    },
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
          form.reset();
        }}
        className='space-y-4'
      >
        <h2>Create a New Workout</h2>

        <form.Field name='name'>
          {(field) => (
            <div className='space-x-4'>
              <label htmlFor='name'>Name:</label>
              <input
                type='text'
                id='name'
                name='name'
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className='px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 active:outline-none active:ring-2 active:ring-indigo-700 border-none shadow-none'
              />
            </div>
          )}
        </form.Field>

        <form.Field name='description'>
          {(field) => (
            <div className='space-x-4'>
              <label htmlFor='description'>Description:</label>
              <input
                type='text'
                id='description'
                name='description'
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className='px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 active:outline-none active:ring-2 active:ring-indigo-700 border-none shadow-none'
              />
            </div>
          )}
        </form.Field>

        <button type='submit'>Create Workout</button>
      </form>
    </div>
  );
};

export default WorkoutCreateFormTanstack;
