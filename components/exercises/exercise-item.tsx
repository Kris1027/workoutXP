import { Prisma } from '@prisma/client';

type ExerciseListProps = {
  exercise: Prisma.ExerciseCreateInput;
};

const ExerciseItem: React.FC<ExerciseListProps> = ({ exercise }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div
      key={exercise.id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
    >
      {/* Image at the top, full width */}
      <div className='w-full h-40 sm:h-48'>
        <img src={exercise.ImageUrl} alt={exercise.name} className='w-full h-full object-cover' />
      </div>

      {/* Content below image */}
      <div className='flex-1 p-4 flex flex-col justify-between'>
        <div>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{exercise.name}</h3>
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
  );
};

export default ExerciseItem;
