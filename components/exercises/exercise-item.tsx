'use client';

import { deleteExercise } from '@/actions/exercise-actions';
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
import type { ExerciseProps } from '@/types/data-types';
import { getDifficultyColor } from '@/utils/get-difficulty-color';
import type { Session } from 'next-auth';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import FitnessCard from '../ui/fitness-card';
import ExerciseForm from './exercise-form';

type ExerciseItemProps = {
  exercise: ExerciseProps;
  session?: Session | null;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, session }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteExercise(id);
        toast.success('Exercise deleted successfully!');
      } catch (error) {
        console.error('Failed to delete exercise:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete exercise. Please try again.'
        );
      }
    });
  };

  // Admin controls
  const adminControls = session?.user.isAdmin ? (
    <>
      <ExerciseForm isEditedExercise={exercise} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            disabled={isPending} 
            variant='destructive' 
            size='sm'
            className='cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white border-0 font-semibold'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the exercise{' '}
              {exercise.name} and remove it from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (exercise.id) handleDelete(exercise.id);
              }}
              className='cursor-pointer'
              disabled={isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) : undefined;

  return (
    <FitnessCard
      id={exercise.id || ''}
      title={exercise.name}
      description={exercise.description}
      imageUrl={exercise.imageUrl}
      imageAlt={exercise.name}
      href={`/exercises/${exercise.id}`}
      theme="orange"
      imageHeight="h-64"
      leftBadge={{
        text: exercise.difficulty,
        className: getDifficultyColor(exercise.difficulty)
      }}
      rightBadge={{
        text: exercise.category,
        className: 'bg-orange-500 text-white'
      }}
      actionText="View Exercise"
      adminControls={adminControls}
    />
  );
};

export default ExerciseItem;