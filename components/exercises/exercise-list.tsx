import { fetchExercises } from '@/actions/exercise-actions';
import { auth } from '@/auth';
import { FaFilter } from 'react-icons/fa';
import ExerciseForm from './exercise-form';
import ExerciseItem from './exercise-item';

const ExerciseList: React.FC = async () => {
  const session = await auth();
  const exercises = await fetchExercises();

  return (
    <div className='px-4 py-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Exercises</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Discover unique exercises{' '}
          {session?.user.isAdmin && (
            <>
              <span>or </span> <ExerciseForm />
            </>
          )}
        </p>
      </div>

      {/* Exercise Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {exercises.map((exercise) => (
          <ExerciseItem key={exercise.id} exercise={exercise} session={session} />
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
