import WorkoutCreationForm from '@/components/workouts/workout-create-form';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const WorkoutsPage = async () => {
  // Fetch both workouts and exercises
  const [workouts, exercises] = await Promise.all([
    prisma.workout.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: true,
      },
    }),
    prisma.exercise.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const createWorkout = async (formData: FormData) => {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrl =
      (formData.get('imageUrl') as string) ||
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin';

    // Get selected exercise IDs
    const selectedExerciseIds = formData.getAll('exercises') as string[];

    // Create workout with selected exercises
    await prisma.workout.create({
      data: {
        name,
        description,
        imageUrl,
        exercises: {
          connect: selectedExerciseIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath('/workouts');
  };

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
