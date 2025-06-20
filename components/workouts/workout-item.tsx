import { WorkoutProps } from '@/types/data-types';
import Image from 'next/image';

type WorkoutItemProps = {
  workout: WorkoutProps;
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout }) => {
  return (
    <div
      key={workout.id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
    >
      {/* Image at the top, full width with 9:10 aspect ratio */}
      <div className='w-full aspect-[9/10] relative'>
        <Image
          src={workout.imageUrl}
          alt={workout.name}
          priority
          fill
          className='object-cover'
          sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'
        />
      </div>

      {/* Content below image */}
      <div className='flex-1 p-4 flex flex-col justify-between'>
        <div>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{workout.name}</h3>
          </div>

          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
            {workout.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutItem;
