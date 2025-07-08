'use client';

import { deleteWorkout } from '@/actions/workouts-action';
import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import WorkoutCreateForm from './workout-form';

type WorkoutItemProps = {
  workout: WorkoutProps;
  allExercises: ExerciseProps[];
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, allExercises }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditedWorkout, setIsEditedWorkout] = useState<WorkoutProps | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (workout: WorkoutProps) => {
    setIsEditing((prev) => {
      const toggled = !prev;
      if (!toggled) {
        setIsEditedWorkout(null);
      } else {
        setIsEditedWorkout(workout);
      }
      return toggled;
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteWorkout(id);
      } catch (error) {
        console.error('Failed to delete workout:', error);
      }
    });
  };

  return (
    <div
      key={workout.id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
    >
      {isEditing ? (
        <WorkoutCreateForm
          exercises={allExercises}
          editedWorkoutExercises={workout.exercises}
          isEditedWorkout={isEditedWorkout}
        />
      ) : (
        <>
          {/* Image at the top, full width with 9:10 aspect ratio */}
          <Link href={`/workouts/${workout.id}`} className='w-full aspect-[9/10] relative'>
            <Image
              src={workout.imageUrl}
              alt={workout.name}
              width={1000}
              height={1000}
              className='min-h-72 object-cover object-center'
            />
          </Link>

          {/* Content below image */}
          <div className='flex-1 p-4 flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{workout.name}</h3>
              </div>

              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                {workout.description}
              </p>
            </div>
          </div>
        </>
      )}
      <div className='flex justify-around items-center'>
        <button onClick={() => handleEdit(workout)}>{isEditing ? 'Cancel' : 'Edit'}</button>
        <button
          onClick={() => {
            if (workout.id) handleDelete(workout.id);
          }}
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutItem;
