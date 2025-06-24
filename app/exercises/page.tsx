import { fetchExercises } from '@/actions/exercises-action';
import ExerciseList from '@/components/exercises/exercise-list';

const ExercisesPage = async () => {
  const exercises = await fetchExercises();

  return <ExerciseList exercises={exercises} />;
};

export default ExercisesPage;
