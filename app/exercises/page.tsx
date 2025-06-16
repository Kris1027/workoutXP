import { getExercises } from '@/lib/exercises-db-actions';
import { getDifficultyColor } from '@/utils/get-difficulty-color';

const ExercisesPage = async () => {
  const exercises = await getExercises();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Workout Exercises</h1>
        <p className='text-gray-600 dark:text-gray-400'>Choose your next exercise</p>
      </div>

      {/* Exercise Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
          >
            {/* Image at the top, full width */}
            <div className='w-full h-40 sm:h-48'>
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Content below image */}
            <div className='flex-1 p-4 flex flex-col justify-between'>
              <div>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    {exercise.name}
                  </h3>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;
