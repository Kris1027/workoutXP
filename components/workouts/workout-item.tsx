'use client';

import { deleteWorkout } from '@/actions/workouts-action';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ExerciseProps, WorkoutProps } from '@/types/data-types';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import WorkoutForm from './workout-form';

type WorkoutItemProps = {
  workout: WorkoutProps;
  allExercises: ExerciseProps[];
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, allExercises }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteWorkout(id);
        toast.success('Workout deleted successfully!');
      } catch (error) {
        console.error('Failed to delete workout:', error);
        toast.error('Failed to delete workout. Please try again.');
      }
    });
  };

  return (
    <div
      key={workout.id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
    >
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

      {/* Action buttons */}
      <div className='flex justify-around items-center p-4 border-t border-gray-100 dark:border-gray-700'>
        <WorkoutForm exercises={allExercises} isEditedWorkout={workout} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isPending}
              className='px-4 py-2 text-red-600 hover:text-red-800 disabled:opacity-50'
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the exercise{' '}
                {workout.name} and remove it from your collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (workout.id) handleDelete(workout.id);
                }}
                className='bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default WorkoutItem;
