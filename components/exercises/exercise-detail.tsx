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
import { Button } from '@/components/ui/button';
import type { ExerciseProps } from '@/types/data-types';
import { getDifficultyColor } from '@/utils/get-difficulty-color';
import type { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FaArrowLeft, FaDumbbell, FaLayerGroup } from 'react-icons/fa';
import { toast } from 'sonner';
import ExerciseForm from './exercise-form';

interface ExerciseDetailProps {
  exercise: ExerciseProps;
  session: Session | null;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise, session }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteExercise(id);
        toast.success('Exercise deleted successfully!');
        router.push('/exercises');
      } catch (error) {
        console.error('Failed to delete exercise:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete exercise. Please try again.'
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <Link href="/exercises">
          <Button variant="ghost" className="mb-6 hover:bg-orange-100 dark:hover:bg-gray-700">
            <FaArrowLeft className="mr-2" />
            Back to Exercises
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={exercise.imageUrl}
              alt={exercise.name}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-500 text-white">
                {exercise.category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {exercise.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {exercise.description}
              </p>
            </div>

            {/* Exercise Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FaLayerGroup className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{exercise.category}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <FaDumbbell className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{exercise.difficulty}</p>
              </div>
            </div>

            {/* Instructions Section */}
            {exercise.instructions && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  How to Perform This Exercise
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {exercise.instructions}
                  </div>
                </div>
              </div>
            )}

            {/* Admin/Owner Controls */}
            {(session?.user.isAdmin || session?.user.id === exercise.userId) && (
              <div className="flex gap-4 pt-4">
                <ExerciseForm isEditedExercise={exercise} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      disabled={isPending} 
                      variant="destructive" 
                      size="lg"
                      className="cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white border-0 font-semibold"
                    >
                      {isPending ? 'Deleting...' : 'Delete Exercise'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the exercise{' '}
                        {exercise.name} and remove it from all workouts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (exercise.id) handleDelete(exercise.id);
                        }}
                        className="cursor-pointer"
                        disabled={isPending}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;