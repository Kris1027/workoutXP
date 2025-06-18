import { getDifficultyColor } from '@/utils/get-difficulty-color';
import { Prisma } from '@prisma/client';
import Image from 'next/image';

type ExerciseListProps = {
  exercise: Prisma.ExerciseCreateInput;
};

const ExerciseItem: React.FC<ExerciseListProps> = ({ exercise }) => {
  return (
    <div
      key={exercise.id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
    >
      {/* Image at the top, full width with 9:10 aspect ratio */}
      <div className='w-full aspect-[9/10] relative'>
        <Image
          src={exercise.ImageUrl}
          alt={exercise.name}
          fill
          className='object-cover'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />
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
