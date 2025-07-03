import { fetchExercises } from '@/actions/exercises-action';
import { fetchWorkouts } from '@/actions/workouts-action';
import WorkoutCreateForm from '@/components/workouts/workout-create-form';
import WorkoutList from '@/components/workouts/workout-list';

const WorkoutsPage = async () => {
  const [workouts, exercises] = await Promise.all([fetchWorkouts(), fetchExercises()]);

  return (
    <div>
      <WorkoutCreateForm exercises={exercises} />
      <WorkoutList workouts={workouts} exercises={exercises} />
    </div>
  );
};

export default WorkoutsPage;
