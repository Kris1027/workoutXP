import { fetchExercises } from '@/actions/exercises-action';
import { fetchWorkouts } from '@/actions/workouts-action';
import WorkoutCreateFormTanstack from '@/components/workouts/workout-create-form-tanstack';
import WorkoutList from '@/components/workouts/workout-list';

const WorkoutsPage = async () => {
  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  return (
    <div>
      <WorkoutCreateFormTanstack exercises={exercises} />
      <WorkoutList workouts={workouts} />
    </div>
  );
};

export default WorkoutsPage;
