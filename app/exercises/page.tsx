import ExerciseList from '@/components/exercises/exercise-list';
import prisma from '@/lib/prisma';

const ExercisesPage = async () => {
  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ExerciseList exercises={exercises} />;
};

export default ExercisesPage;
