import WorkoutCard from '@/components/workouts/workout-card';

interface WorkoutDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const WorkoutDetailsPage: React.FC<WorkoutDetailsPageProps> = async ({ params }) => {
  const { id } = await params;
  return <WorkoutCard id={id} />;
};

export default WorkoutDetailsPage;
