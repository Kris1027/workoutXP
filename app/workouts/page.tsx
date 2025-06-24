import { createWorkout, fetchWorkouts } from '@/actions/workouts-action';
import WorkoutCreationForm from '@/components/workouts/workout-create-form';
import prisma from '@/lib/prisma';

const WorkoutsPage = async () => {
  // Fetch workouts and exercises
  const [workouts, exercises] = await Promise.all([
    fetchWorkouts(),
    prisma.exercise.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 py-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
          Create New Workout
        </h1>

        <WorkoutCreationForm
          exercises={exercises}
          createWorkout={createWorkout}
          existingWorkouts={workouts}
        />
      </div>
    </div>
  );
};

export default WorkoutsPage;
