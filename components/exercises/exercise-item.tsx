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
import { getDateMetadata } from '@/utils/date-utils';
import { formatDate } from '@/utils/format-date';
import { getDifficultyColor } from '@/utils/get-difficulty-color';
import type { Session } from 'next-auth';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { ActionButton } from '../ui/action-button';
import { FaTrash } from 'react-icons/fa';
import FitnessCard from '../ui/fitness-card';
import ExerciseForm from './exercise-form';

type ExerciseItemProps = {
  exercise: ExerciseProps;
  session?: Session | null;
  workoutId?: string;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, session, workoutId }) => {
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

  // Show controls if user is the creator or admin
  const canEditOrDelete = session?.user.isAdmin || exercise.userId === session?.user.id;

  // Determine if exercise was edited and format date accordingly
  const { dateToShow, dateLabel } = getDateMetadata(exercise.updatedAt, exercise.createdAt);

  // Metadata component
  const metadata = exercise.user ? (
    <div className='text-gray-500 dark:text-gray-400 text-xs'>
      {dateLabel} by <span className='font-bold text-gray-700 dark:text-gray-200'>{exercise.user.name || 'Anonymous'}</span>
      {dateToShow && (
        <span className='block mt-1'>
          {formatDate(new Date(dateToShow))}
        </span>
      )}
    </div>
  ) : undefined;

  // Admin/Owner controls
  const adminControls = canEditOrDelete ? (
    <div className="flex gap-2">
      <ExerciseForm isEditedExercise={exercise} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <ActionButton 
            disabled={isPending}
            variant='danger'
            size='sm'
            icon={<FaTrash className="w-3 h-3" />}
            loading={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </ActionButton>
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
    </div>
  ) : undefined;

  return (
    <FitnessCard
      id={exercise.id || ''}
      title={exercise.name}
      description={exercise.description}
      imageUrl={exercise.imageUrl}
      imageAlt={exercise.name}
      href={`/exercises/${exercise.id}${workoutId ? `?from=workout&workoutId=${workoutId}` : ''}`}
      theme="orange"
      imageHeight="h-64"
      leftBadge={{
        text: exercise.difficulty,
        className: getDifficultyColor(exercise.difficulty)
      }}
      metadata={metadata}
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