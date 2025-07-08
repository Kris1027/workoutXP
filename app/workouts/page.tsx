import { fetchExercises } from '@/actions/exercises-action';
import { fetchWorkouts } from '@/actions/workouts-action';
import WorkoutForm from '@/components/workouts/workout-form';
import WorkoutList from '@/components/workouts/workout-list';

const WorkoutsPage = async () => {
  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  return (
    <div>
      <WorkoutForm exercises={exercises} />
      <WorkoutList workouts={workouts} exercises={exercises} />
    </div>
  );
};

export default WorkoutsPage;
