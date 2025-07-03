'use client';

import { createWorkout } from '@/actions/workouts-action';
import { createWorkoutSchema } from '@/schemas/data-schemas';
import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';

interface WorkoutCreateFormTanstackProps {
  exercises: ExerciseProps[];
}

const WorkoutCreateForm: React.FC<WorkoutCreateFormTanstackProps> = ({ exercises }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      imageUrl:
        'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin',
      description: '',
      exercises: [] as ExerciseProps[],
    } as WorkoutProps,
    validators: {
      onSubmit: createWorkoutSchema,
    },
    onSubmit: async ({ value }) => {
      await createWorkout(value);
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
        <h1>Tanstack form</h1>

        {/* name */}
        <form.Field name='name'>
          {(field) => (
            <div>
              <label htmlFor='name'>Workout name:</label>
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

        {/* description */}
        <form.Field name='description'>
          {(field) => (
            <div>
              <label htmlFor='description'>Workout description:</label>
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

        {/* exercises */}
        <form.Field name='exercises'>
          {(field) => (
            <div>
              <label>Select Exercises:</label>
              <ul>
                {exercises.map((exercise) => (
                  <li key={exercise.id} className='flex'>
                    <input
                      type='checkbox'
                      checked={field.state.value.some((ex) => ex.id === exercise.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.handleChange([...field.state.value, exercise]);
                        } else {
                          field.handleChange([
                            ...field.state.value.filter((ex) => ex.id != exercise.id),
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

        <button type='submit' className='py-2 px-10 bg-amber-700 cursor-pointer'>
          Create Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutCreateForm;
