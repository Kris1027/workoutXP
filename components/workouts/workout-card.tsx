import { fetchWorkoutById } from '@/actions/workout-actions';
import { auth } from '@/auth';
import ExerciseItem from '../exercises/exercise-item';
import { FaFilter } from 'react-icons/fa';
import WorkoutLikeButton from './workout-like-button';
import WorkoutSession from './workout-session';
import { formatDate } from '@/utils/format-date';
import { getDifficultyColor } from '@/utils/get-difficulty-color';

interface WorkoutCardProps {
  id: string;
}

const WorkoutCard = async ({ id }: WorkoutCardProps) => {
  const session = await auth();
  const currentUser = session?.user;
  const detailedWorkout = await fetchWorkoutById(id);
  const exercises = detailedWorkout?.exercises || [];

  if (!detailedWorkout) {
    return (
      <div className='px-4 py-6 text-center'>
        <h1 className='text-3xl font-bold mb-2'>Workout Not Found</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          The workout you are looking for does not exist or could not be loaded.
        </p>
      </div>
    );
  }

  // Determine if workout was edited and format date accordingly
  const wasEdited = detailedWorkout.updatedAt && detailedWorkout.createdAt && 
    new Date(detailedWorkout.updatedAt).getTime() > new Date(detailedWorkout.createdAt).getTime();
  const dateToShow = wasEdited ? detailedWorkout.updatedAt : detailedWorkout.createdAt;
  const dateLabel = wasEdited ? 'Updated' : 'Created';

  return (
    <div className='px-4 py-6'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>{detailedWorkout?.name}</h1>
            <p className='text-gray-600 dark:text-gray-400'>{detailedWorkout?.description}</p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              {dateLabel} by <span className='font-semibold'>{detailedWorkout?.user?.name}</span>
              {dateToShow && (
                <span className='block text-xs mt-1'>
                  {formatDate(new Date(dateToShow))}
                </span>
              )}
            </p>
            {detailedWorkout?.difficulty && (
              <span className={`inline-block mt-2 ${getDifficultyColor(detailedWorkout.difficulty)}`}>
                {detailedWorkout.difficulty}
              </span>
            )}
          </div>
          <div className='ml-4'>
            <WorkoutLikeButton
              workoutId={detailedWorkout.id!}
              initialIsLiked={detailedWorkout.isLikedByUser || false}
              initialLikeCount={detailedWorkout._count?.likes || 0}
              isAuthenticated={!!currentUser}
            />
          </div>
        </div>
      </div>

      {/* Workout Session with Timer and Exercise Grid */}
      <WorkoutSession workoutId={detailedWorkout.id}>
        {exercises.map((exercise) => (
          <ExerciseItem key={exercise.id} exercise={exercise} workoutId={detailedWorkout.id} />
        ))}
      </WorkoutSession>

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

export default WorkoutCard;
