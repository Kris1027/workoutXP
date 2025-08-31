import { fetchExerciseById } from '@/actions/exercise-actions';
import { auth } from '@/auth';
import ExerciseDetail from '@/components/exercises/exercise-detail';
import { notFound } from 'next/navigation';

interface ExerciseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ExerciseDetailPage = async ({ params }: ExerciseDetailPageProps) => {
  const session = await auth();
  const { id } = await params;
  const exercise = await fetchExerciseById(id);

  if (!exercise) {
    notFound();
  }

  return <ExerciseDetail exercise={exercise} session={session} />;
};

export default ExerciseDetailPage;