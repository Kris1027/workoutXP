import { fetchExercises } from '@/actions/exercise-actions';
import { fetchWorkouts } from '@/actions/workout-actions';
import { auth } from '@/auth';
import ExerciseList from '@/components/exercises/exercise-list';
import WorkoutList from '@/components/workouts/workout-list';

const AdminDashboardPage = async () => {
  const session = await auth();
  if (!session?.user.isAdmin) return;

  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  return (
    <div>
      <ExerciseList exercises={exercises} />
      <WorkoutList workouts={workouts} exercises={exercises} />
    </div>
  );
};

export default AdminDashboardPage;
