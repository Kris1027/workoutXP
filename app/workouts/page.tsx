import WorkoutList from '@/components/workouts/workout-list';
import prisma from '@/lib/prisma';

const WorkoutsPage = async () => {
  const workouts = await prisma.workout.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <WorkoutList workouts={workouts} />;
};

export default WorkoutsPage;
