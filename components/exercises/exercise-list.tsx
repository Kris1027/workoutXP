import { fetchExercises } from '@/actions/exercise-actions';
import { auth } from '@/auth';
import { FaFilter, FaRunning, FaChartBar, FaLayerGroup, FaMedal } from 'react-icons/fa';
import ExerciseForm from './exercise-form';
import ExerciseItem from './exercise-item';
import PageHeader from '../ui/page-header';
import { Badge } from '../ui/badge';
import { APP_CONFIG } from '@/constants/config';

const ExerciseList: React.FC = async () => {
  const session = await auth();
  const exercises = await fetchExercises();

  // Calculate stats
  const totalExercises = exercises.length;
  const categories = [...new Set(exercises.map(e => e.category))].length;
  const userExercises = session?.user ? exercises.filter(e => e.userId === session.user.id).length : 0;
  
  // Check for new exercises (created in last N days based on config)
  const hasNewExercises = exercises.some(e => {
    if (!e.createdAt) return false;
    const createdDate = new Date(e.createdAt);
    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= APP_CONFIG.SHOW_NEW_BADGE_DAYS;
  });

  return (
    <div className='px-4 py-6'>
      {/* Modern Header */}
      <PageHeader
        title="Exercises"
        subtitle="Build your perfect routine"
        badge={hasNewExercises ? <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">New</Badge> : null}
        description="Browse through our comprehensive exercise library. Each exercise includes detailed instructions, proper form guidance, and difficulty ratings to help you train effectively and safely."
        icon={<FaRunning />}
        gradient="purple"
        stats={[
          {
            label: 'Total Exercises',
            value: totalExercises,
            icon: <FaChartBar className="text-purple-500" />,
          },
          {
            label: 'Categories',
            value: categories,
            icon: <FaLayerGroup className="text-blue-500" />,
          },
          ...(session?.user ? [{
            label: 'Your Exercises',
            value: userExercises,
            icon: <FaMedal className="text-yellow-500" />,
          }] : []),
        ]}
        actions={
          session?.user && (
            <ExerciseForm />
          )
        }
      />

      {/* Exercise Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
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
