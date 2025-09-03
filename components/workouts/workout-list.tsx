import { fetchExercises } from '@/actions/exercise-actions';
import { fetchWorkouts } from '@/actions/workout-actions';
import { auth } from '@/auth';
import { FaFilter, FaFire, FaDumbbell, FaChartLine, FaTrophy } from 'react-icons/fa';
import WorkoutForm from './workout-form';
import WorkoutItem from './workout-item';
import { UserProps } from '@/types/data-types';
import Link from 'next/link';
import { ActionButton } from '../ui/action-button';
import PageHeader from '../ui/page-header';
import { Badge } from '../ui/badge';

const WorkoutList: React.FC = async () => {
  const session = await auth();
  const currentUser = session?.user as UserProps | null;
  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  // Calculate stats
  const totalWorkouts = workouts.length;
  const userWorkouts = currentUser ? workouts.filter(w => w.userId === currentUser.id).length : 0;
  const totalLikes = workouts.reduce((sum, w) => sum + (w._count?.likes || 0), 0);
  
  // Check for new workouts (created in last 7 days)
  const hasNewWorkouts = workouts.some(w => {
    if (!w.createdAt) return false;
    const createdDate = new Date(w.createdAt);
    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  return (
    <div className='px-4 py-6'>
      {/* Modern Header */}
      <PageHeader
        title="Workouts"
        subtitle="Transform your fitness journey"
        badge={hasNewWorkouts ? <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">New</Badge> : null}
        description="Explore our collection of professionally crafted workout routines designed to help you achieve your fitness goals. From beginner-friendly sessions to advanced challenges."
        icon={<FaDumbbell />}
        gradient="orange"
        stats={[
          {
            label: 'Total Workouts',
            value: totalWorkouts,
            icon: <FaChartLine className="text-orange-500" />,
          },
          ...(currentUser ? [{
            label: 'Your Workouts',
            value: userWorkouts,
            icon: <FaTrophy className="text-purple-500" />,
          }] : []),
          {
            label: 'Community Likes',
            value: totalLikes,
            icon: <FaFire className="text-red-500" />,
          },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            {currentUser && (
              <WorkoutForm exercises={exercises} currentUserId={currentUser.id} />
            )}
            <Link href='/workouts/top'>
              <ActionButton
                variant='glass'
                size='md'
                icon={<FaFire />}
              >
                Top Workouts
              </ActionButton>
            </Link>
          </div>
        }
      />

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
