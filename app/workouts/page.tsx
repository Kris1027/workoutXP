import { fetchExercises } from '@/actions/exercise-actions';
import { fetchAllUsers } from '@/actions/user-actions';
import { fetchWorkouts } from '@/actions/workout-actions';
import { auth } from '@/auth';
import WorkoutList from '@/components/workouts/workout-list';

const WorkoutsPage = async () => {
  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.isAdmin;
  const [workouts, exercises, users] = await Promise.all([
    fetchWorkouts(),
    fetchExercises(),
    fetchAllUsers(),
  ]);

  return (
    <WorkoutList
      workouts={workouts}
      exercises={exercises}
      users={users}
      currentUserId={currentUserId}
      isAdmin={isAdmin}
    />
  );
};

export default WorkoutsPage;
