import { fetchExercises } from '@/actions/exercise-actions';
import { fetchAllUsers } from '@/actions/user-actions';
import { fetchWorkouts } from '@/actions/workout-actions';
import WorkoutList from '@/components/workouts/workout-list';

const WorkoutsPage = async () => {
  const [workouts, exercises, users] = await Promise.all([
    fetchWorkouts(),
    fetchExercises(),
    fetchAllUsers(),
  ]);

  return <WorkoutList workouts={workouts} exercises={exercises} users={users} />;
};

export default WorkoutsPage;
