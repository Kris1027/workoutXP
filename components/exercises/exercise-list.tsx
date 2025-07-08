import type { ExerciseProps } from '@/types/data-types';
import { FaFilter } from 'react-icons/fa';
import ExerciseForm from './exercise-form';
import ExerciseItem from './exercise-item';

type ExerciseListProps = {
  exercises: ExerciseProps[];
};

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Exercises</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Discover unique exercises or <ExerciseForm />
        </p>
      </div>

      {/* Exercise Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {exercises.map((exercise) => (
          <ExerciseItem key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {exercises.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <FaFilter className='text-5xl mx-auto' />
          </div>
          <p className='text-gray-500 dark:text-gray-400'>
            No exercises found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
