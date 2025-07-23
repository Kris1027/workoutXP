import { fetchExercises } from '@/actions/exercise-actions';
import { fetchWorkouts } from '@/actions/workout-actions';
import { auth } from '@/auth';
import { FaFilter, FaFire } from 'react-icons/fa';
import WorkoutForm from './workout-form';
import WorkoutItem from './workout-item';
import { UserProps } from '@/types/data-types';
import Link from 'next/link';
import { Button } from '../ui/button';

const WorkoutList: React.FC = async () => {
  const session = await auth();
  const currentUser = session?.user as UserProps | null;
  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  return (
    <div className='px-4 py-6'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Workouts</h1>
            <p className='text-gray-600 dark:text-gray-400'>
              Discover unique workouts{' '}
              {currentUser && (
                <>
                  <span>or </span> <WorkoutForm exercises={exercises} currentUserId={currentUser.id} />
                </>
              )}
            </p>
          </div>
          <Link href='/workouts/top'>
            <Button variant='outline' className='flex items-center gap-2'>
              <FaFire className='text-orange-500' />
              Top Workouts
            </Button>
          </Link>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {workouts.map((workout) => (
          <WorkoutItem
            key={workout.id}
            workout={workout}
            allExercises={exercises}
            currentUser={currentUser}
          />
        ))}
      </div>

      {workouts.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <FaFilter className='text-5xl mx-auto' />
          </div>
          <p className='text-gray-500 dark:text-gray-400'>
            No workouts found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
