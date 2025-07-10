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
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import WorkoutForm from './workout-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type WorkoutItemProps = {
  workout: WorkoutProps;
  allExercises: ExerciseProps[];
  users?: UserProps[];
  currentUserId?: string;
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({
  workout,
  allExercises,
  users,
  currentUserId,
}) => {
  const [isPending, startTransition] = useTransition();

  const user = users?.find((user) => user.id === workout.userId);

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

  return (
    <Card key={workout.id}>
      <CardHeader className='space-y-2'>
        <Link href={`/workouts/${workout.id}`}>
          <Image
            src={workout.imageUrl}
            alt={workout.name}
            width={0}
            height={400}
            sizes='100vw'
            className='object-cover rounded-md w-full h-[400px]'
            priority
          />
        </Link>
        <CardTitle>{workout.name}</CardTitle>
      </CardHeader>

      <CardContent className='space-y-2'>
        <CardDescription>{workout.description}</CardDescription>
        <CardDescription>
          created by <span className='font-bold'>{user?.name}</span>
        </CardDescription>
      </CardContent>

      {currentUserId === workout.userId && (
        <CardFooter className='flex justify-between items-center'>
          <WorkoutForm exercises={allExercises} isEditedWorkout={workout} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isPending} variant='destructive' className='cursor-pointer'>
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
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
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkoutItem;
