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
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
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

  return (
    <Card key={exercise.id}>
      <CardHeader className='space-y-2'>
        <Image
          src={exercise.imageUrl}
          alt={exercise.name}
          width={0}
          height={400}
          sizes='100vw'
          className='object-cover rounded-md w-full h-[400px]'
          priority
        />
        <CardTitle className='text-center '>{exercise.name}</CardTitle>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className={` ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
          <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'>
            {exercise.category}
          </span>
        </div>
        <CardDescription>{exercise.description}</CardDescription>
      </CardContent>

      {session?.user.isAdmin && (
        <CardFooter className='flex justify-between items-center'>
          <ExerciseForm isEditedExercise={exercise} />

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
        </CardFooter>
      )}
    </Card>
  );
};

export default ExerciseItem;
