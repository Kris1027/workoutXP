'use client';

import { deleteWorkout } from '@/actions/workout-actions';
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
import type { ExerciseProps, UserProps, WorkoutProps } from '@/types/data-types';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { ActionButton } from '../ui/action-button';
import { FaTrash } from 'react-icons/fa';
import FitnessCard from '../ui/fitness-card';
import WorkoutForm from './workout-form';
import WorkoutLikeButton from './workout-like-button';
import { formatDate } from '@/utils/format-date';
import { getDifficultyColor } from '@/utils/get-difficulty-color';

type WorkoutItemProps = {
  workout: WorkoutProps;
  allExercises: ExerciseProps[];
  currentUser: UserProps | null | undefined;
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, allExercises, currentUser }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteWorkout(id);
        toast.success('Workout deleted successfully!');
      } catch (error) {
        console.error('Failed to delete workout:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete workout. Please try again.'
        );
      }
    });
  };

  // Show controls if user is the creator or admin
  const canEditOrDelete = currentUser?.isAdmin || workout.userId === currentUser?.id;

  // Determine if workout was edited and format date accordingly
  const wasEdited = workout.updatedAt && workout.createdAt && 
    new Date(workout.updatedAt).getTime() > new Date(workout.createdAt).getTime();
  const dateToShow = wasEdited ? workout.updatedAt : workout.createdAt;
  const dateLabel = wasEdited ? 'updated' : 'created';

  // Metadata component
  const metadata = (
    <div className='text-gray-500 dark:text-gray-400 text-xs'>
      {dateLabel} by <span className='font-bold text-gray-700 dark:text-gray-200'>{workout.user?.name}</span>
      {dateToShow && (
        <span className='block mt-1'>
          {formatDate(new Date(dateToShow))}
        </span>
      )}
      {workout.difficulty && (
        <span className={`inline-block mt-2 ${getDifficultyColor(workout.difficulty)}`}>
          {workout.difficulty}
        </span>
      )}
    </div>
  );

  // Action component (like button)
  const actionComponent = (
    <WorkoutLikeButton
      workoutId={workout.id!}
      initialIsLiked={workout.isLikedByUser || false}
      initialLikeCount={workout._count?.likes || 0}
      isAuthenticated={!!currentUser}
    />
  );

  // Admin controls
  const adminControls = canEditOrDelete ? (
    <div className="flex gap-2">
      <WorkoutForm
        exercises={allExercises}
        isEditedWorkout={workout}
        currentUserId={currentUser?.id}
      />
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
              This action cannot be undone. This will permanently delete the workout{' '}
              {workout.name} and remove it from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (workout.id) handleDelete(workout.id);
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
      id={workout.id || ''}
      title={workout.name}
      description={workout.description}
      imageUrl={workout.imageUrl}
      imageAlt={workout.name}
      href={`/workouts/${workout.id}`}
      theme="blue"
      imageHeight="h-56"
      leftBadge={{
        text: `${workout.exercises.length} Exercises`,
        className: 'bg-blue-500 text-white'
      }}
      rightBadge={{
        text: `${workout._count?.likes || 0} Likes`,
        className: 'bg-white/90 text-gray-900'
      }}
      metadata={metadata}
      actionComponent={actionComponent}
      actionText="View Workout"
      adminControls={adminControls}
    />
  );
};

export default WorkoutItem;