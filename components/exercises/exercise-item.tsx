'use client';

import { deleteExercise } from '@/actions/exercises-action';
import type { ExerciseProps } from '@/types/data-types';
import { getDifficultyColor } from '@/utils/get-difficulty-color';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import ExerciseCreateForm from './exercise-create-form';

type ExerciseItemProps = {
  exercise: ExerciseProps;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditedExercise, setIsEditedExercise] = useState<ExerciseProps | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (exercise: ExerciseProps) => {
    setIsEditing((prev) => {
      const toggled = !prev;
      if (!toggled) {
        setIsEditedExercise(null);
      } else {
        setIsEditedExercise(exercise);
      }
      return toggled;
    });
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    setIsEditedExercise(null);
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
      {/* Image at the top, full width with 9:10 aspect ratio */}
      {isEditing ? (
        <ExerciseCreateForm
          key={isEditedExercise?.id || 'new'}
          isEditedExercise={isEditedExercise}
          handleEditComplete={handleEditComplete}
        />
      ) : (
        <>
          <div className='w-full aspect-[9/10] relative'>
            <Image
              src={exercise.imageUrl}
              alt={exercise.name}
              priority
              fill
              className='object-cover'
              sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'
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
        </>
      )}
      <div className='flex justify-around items-center'>
        <button onClick={() => handleEdit(exercise)}>{isEditing ? 'Cancel' : 'Edit'}</button>
        <button
          onClick={() => {
            if (exercise.id) handleDelete(exercise.id);
          }}
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;
