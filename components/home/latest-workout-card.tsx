import { fetchLatestWorkoutSession } from '@/actions/workout-session-actions';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaDumbbell, FaTrophy, FaArrowRight } from 'react-icons/fa';
import { formatDateTimeRelative, formatDateTime } from '@/utils/format-date-time';
import { getDifficultyColor } from '@/utils/get-difficulty-color';

const LatestWorkoutCard = async () => {
  const latestSession = await fetchLatestWorkoutSession();

  if (!latestSession) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const completionRate = Math.round((latestSession.exercisesCompleted / latestSession.totalExercises) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FaTrophy className="text-2xl text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Latest Workout</h2>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={latestSession.workout.imageUrl}
            alt={latestSession.workout.name}
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-2">{latestSession.workout.name}</h3>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(latestSession.workout.difficulty)}`}>
                {latestSession.workout.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="text-xs" />
                {formatDuration(latestSession.duration)}
              </span>
              <span className="flex items-center gap-1">
                <FaDumbbell className="text-xs" />
                {latestSession.exercisesCompleted}/{latestSession.totalExercises} exercises
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Completion Rate
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  completionRate === 100 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-blue-500 to-green-500'
                }`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400" title={formatDateTime(new Date(latestSession.completedAt))}>
              Completed {formatDateTimeRelative(new Date(latestSession.completedAt))}
            </div>
            
            <Link 
              href={`/workouts/${latestSession.workoutId}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Do Again
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestWorkoutCard;