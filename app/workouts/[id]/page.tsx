import Loading from '@/app/loading';
import WorkoutCard from '@/components/workouts/workout-card';
import { Suspense } from 'react';

interface WorkoutDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const WorkoutDetailsPage: React.FC<WorkoutDetailsPageProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <WorkoutCard id={id} />
    </Suspense>
  );
};

export default WorkoutDetailsPage;
