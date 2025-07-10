import { fetchExercises } from '@/actions/exercise-actions';
import { auth } from '@/auth';
import ExerciseList from '@/components/exercises/exercise-list';

const ExercisesPage = async () => {
  const session = await auth();
  const exercises = await fetchExercises();

  return <ExerciseList exercises={exercises} session={session} />;
};

export default ExercisesPage;
