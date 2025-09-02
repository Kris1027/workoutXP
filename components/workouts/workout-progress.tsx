'use client';

import { Progress } from '@/components/ui/progress';
import { FaCheckCircle, FaDumbbell, FaTrophy } from 'react-icons/fa';

interface WorkoutProgressProps {
  completedCount: number;
  totalCount: number;
  isActive: boolean;
}

const WorkoutProgress = ({ completedCount, totalCount, isActive }: WorkoutProgressProps) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isCompleted = completedCount === totalCount && totalCount > 0;

  if (!isActive || totalCount === 0) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <FaTrophy className="text-2xl text-yellow-500" />
          ) : (
            <FaDumbbell className="text-2xl text-blue-500 dark:text-blue-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {isCompleted ? 'Workout Complete!' : 'Workout Progress'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {completedCount} of {totalCount} exercises completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(progressPercentage)}%
          </span>
          {isCompleted && (
            <FaCheckCircle className="text-2xl text-green-500" />
          )}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-3 bg-gray-200 dark:bg-gray-600"
      />

      {/* Milestone badges */}
      {completedCount > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {completedCount >= Math.floor(totalCount * 0.25) && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              25% Complete
            </span>
          )}
          {completedCount >= Math.floor(totalCount * 0.5) && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Halfway There!
            </span>
          )}
          {completedCount >= Math.floor(totalCount * 0.75) && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
              Almost Done!
            </span>
          )}
          {isCompleted && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Champion! 🎉
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutProgress;