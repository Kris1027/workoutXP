import { fetchExercises } from '@/actions/exercises-action';
import { fetchWorkouts } from '@/actions/workouts-action';
import WorkoutList from '@/components/workouts/workout-list';

const WorkoutsPage = async () => {
  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  return <WorkoutList workouts={workouts} exercises={exercises} />;
};

export default WorkoutsPage;
