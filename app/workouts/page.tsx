import WorkoutList from '@/components/workouts/workout-list';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import Form from 'next/form';

const WorkoutsPage = async () => {
  const workouts = await prisma.workout.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      exercises: true,
    },
  });

  const createWorkout = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    const imageUrl =
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin';
    const description = formData.get('description') as string;

    await prisma.workout.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });
    revalidatePath('/workouts');
  };

  return (
    <>
      <Form action={createWorkout} className='p-10'>
        <div>
          <label htmlFor='name'>Name</label>
          <input type='text' id='name' name='name' required />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <textarea id='description' name='description' required></textarea>
        </div>
        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
          Create Workout
        </button>
      </Form>
      <WorkoutList workouts={workouts} />;
    </>
  );
};

export default WorkoutsPage;
