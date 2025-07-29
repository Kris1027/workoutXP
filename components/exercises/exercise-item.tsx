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
import { Card, CardContent } from '../ui/card';
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
    <Card key={exercise.id} className='group relative overflow-hidden bg-white dark:bg-black/90 border border-gray-200 dark:border-gray-800 hover:border-orange-500/50 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-orange-500/10 p-0'>
      {/* Image with overlay */}
      <div className='relative h-64 overflow-hidden'>
        <Image
          src={exercise.imageUrl}
          alt={exercise.name}
          width={0}
          height={0}
          sizes='100vw'
          className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          priority
        />
        {/* Overlay for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent dark:from-black dark:via-black/50 dark:to-transparent' />
        
        {/* Difficulty badge on image */}
        <div className='absolute top-3 left-3'>
          <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getDifficultyColor(exercise.difficulty)} shadow-lg`}>
            {exercise.difficulty}
          </span>
        </div>

        {/* Category badge on image */}
        <div className='absolute top-3 right-3'>
          <span className='px-2 py-1 text-xs font-semibold uppercase tracking-wider bg-orange-500 text-white rounded shadow-lg'>
            {exercise.category}
          </span>
        </div>

        

        {/* Exercise name overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <h3 className='text-white font-bold text-lg leading-tight group-hover:text-orange-400 transition-colors duration-500 ease-out'>
            {exercise.name}
          </h3>
        </div>
      </div>

      {/* Content section */}
      <CardContent className='p-4'>
        <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3'>
          {exercise.description}
        </p>
        
        {/* Action indicator */}
        <div className='mt-3 flex items-center text-orange-600 dark:text-orange-500 text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out'>
          <span>View Exercise</span>
          <svg className='w-3 h-3 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>
      </CardContent>

      {/* Admin controls at bottom */}
      {session?.user.isAdmin && (
        <div className='flex justify-between items-center p-3'>
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
        </div>
      )}
    </Card>
  );
};

export default ExerciseItem;