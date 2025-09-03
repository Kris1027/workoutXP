import { fetchUserWorkoutSessions } from '@/actions/workout-session-actions';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaDumbbell, FaTrophy, FaFireAlt, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { formatDateTime } from '@/utils/format-date-time';

const FinishedWorkouts = async () => {
  const workoutSessions = await fetchUserWorkoutSessions(20);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Calculate stats
  const totalWorkouts = workoutSessions.length;
  const totalDuration = workoutSessions.reduce((acc, session) => acc + session.duration, 0);
  const totalExercises = workoutSessions.reduce((acc, session) => acc + session.exercisesCompleted, 0);
  const avgCompletionRate = workoutSessions.length > 0 
    ? Math.round(workoutSessions.reduce((acc, session) => 
        acc + (session.exercisesCompleted / session.totalExercises * 100), 0) / workoutSessions.length)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
              <FaTrophy className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Your Fitness Journey
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your progress and celebrate your achievements
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FaFireAlt className="text-orange-500 text-xl" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Workouts</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FaClock className="text-blue-500 text-xl" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(totalDuration)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FaDumbbell className="text-purple-500 text-xl" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalExercises}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exercises Done</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FaChartLine className="text-green-500 text-xl" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{avgCompletionRate}%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Completion</p>
            </div>
          </div>
        </div>

        {/* Workout Sessions Grid with Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workoutSessions.map((session) => {
            const completionRate = Math.round((session.exercisesCompleted / session.totalExercises) * 100);
            
            return (
              <Link 
                key={session.id} 
                href={`/workouts/${session.workoutId}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={session.workout.imageUrl}
                    alt={session.workout.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Completion Badge */}
                  {completionRate === 100 && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <FaCheckCircle />
                      Completed
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg
                      ${session.workout.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                        session.workout.difficulty === 'Medium' ? 'bg-yellow-500 text-white' :
                        session.workout.difficulty === 'Hard' ? 'bg-red-500 text-white' :
                        'bg-purple-500 text-white'}`}>
                      {session.workout.difficulty}
                    </span>
                  </div>
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {session.workout.name}
                    </h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <FaClock />
                        {formatDuration(session.duration)}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <FaDumbbell />
                        {session.exercisesCompleted}/{session.totalExercises}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className={`text-sm font-bold ${
                        completionRate === 100 ? 'text-green-600 dark:text-green-400' :
                        completionRate >= 75 ? 'text-blue-600 dark:text-blue-400' :
                        completionRate >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>
                        {completionRate}%
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                          completionRate === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          completionRate >= 75 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                          completionRate >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                          'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Date and Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(new Date(session.completedAt))}
                    </span>
                    
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                      Do Again
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FinishedWorkouts;