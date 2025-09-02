import { fetchExerciseById } from '@/actions/exercise-actions';
import { auth } from '@/auth';
import ExerciseDetail from '@/components/exercises/exercise-detail';
import { notFound } from 'next/navigation';

interface ExerciseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ExerciseDetailPage = async ({ params, searchParams }: ExerciseDetailPageProps) => {
  const session = await auth();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const exercise = await fetchExerciseById(id);

  if (!exercise) {
    notFound();
  }

  const from = resolvedSearchParams?.from as string | undefined;
  const workoutId = resolvedSearchParams?.workoutId as string | undefined;

  return <ExerciseDetail exercise={exercise} session={session} from={from} workoutId={workoutId} />;
};

export default ExerciseDetailPage;