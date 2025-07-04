'use client';

import { createWorkout, updateWorkout } from '@/actions/workouts-action';
import { createWorkoutSchema } from '@/schemas/data-schemas';
import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import { UploadButton } from '@/utils/uploadthing';
import { useForm } from '@tanstack/react-form';
import Image from 'next/image';

interface WorkoutCreateFormTanstackProps {
  exercises: ExerciseProps[];
  editedWorkoutExercises?: ExerciseProps[];
  isEditedWorkout?: WorkoutProps | null;
  handleEditComplete?: () => void;
}

const WorkoutCreateForm: React.FC<WorkoutCreateFormTanstackProps> = ({
  exercises,
  isEditedWorkout,
  handleEditComplete,
  editedWorkoutExercises,
}) => {
  const form = useForm({
    defaultValues: {
      id: isEditedWorkout?.id || '',
      name: isEditedWorkout?.name || '',
      imageUrl: isEditedWorkout?.imageUrl || '',
      description: isEditedWorkout?.description || '',
      exercises: editedWorkoutExercises || ([] as ExerciseProps[]),
    } as WorkoutProps,
    validators: {
      onChange: createWorkoutSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditedWorkout) {
        await updateWorkout(value);
        form.reset();
      } else {
        await createWorkout(value);
        form.reset();
      }
      if (handleEditComplete) {
        handleEditComplete();
      }
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
        <h1>{isEditedWorkout ? 'Update Workout' : 'Create New Workout'}</h1>

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
                  console.error(`Error! ${error.message}`); // let's replace this with toast later
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
                {exercises &&
                  exercises.map((exercise) => (
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
          {isEditedWorkout ? 'Update Workout' : 'Create Workout'}
        </button>
      </form>
    </div>
  );
};

export default WorkoutCreateForm;
