'use client';

import { deleteExercise } from '@/actions/exercises-action';
import type { ExerciseProps } from '@/types/data-types';
import { getDifficultyColor } from '@/utils/get-difficulty-color';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import ExerciseCreateForm from './exercise-create-form';
import { Button } from '../ui/button';

type ExerciseItemProps = {
  exercise: ExerciseProps;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [isPending, startTransition] = useTransition();

  const handleEditComplete = () => {
    // This will be called when the edit is complete and the modal closes
    console.log('Edit completed');
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteExercise(id);
      } catch (error) {
        console.error('Failed to delete exercise:', error);
      }
    });
  };

  return (
    <div
      key={exercise.id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
    >
      <div className='w-full aspect-[9/10] relative'>
        <Image
          src={exercise.imageUrl}
          alt={exercise.name}
          width={1000}
          height={1000}
          className='min-h-72 object-cover object-center'
        />
      </div>

      {/* Content below image */}
      <div className='flex-1 p-4 flex flex-col justify-between'>
        <div>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{exercise.name}</h3>
          </div>

          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
            {exercise.description}
          </p>
        </div>

        <div className='flex justify-between items-center'>
          <div className='flex flex-wrap gap-2'>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                exercise.difficulty
              )}`}
            >
              {exercise.difficulty}
            </span>
            <span className='px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium'>
              {exercise.category}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex justify-around items-center p-4 border-t border-gray-100 dark:border-gray-700'>
        <ExerciseCreateForm isEditedExercise={exercise} handleEditComplete={handleEditComplete} />
        <Button
          onClick={() => {
            if (exercise.id) handleDelete(exercise.id);
          }}
          disabled={isPending}
          variant='destructive'
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};

export default ExerciseItem;
