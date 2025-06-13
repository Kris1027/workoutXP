const fakeData = [
  { id: 1, name: 'Push Up', description: 'A basic upper body exercise.' },
  { id: 2, name: 'Squat', description: 'A fundamental lower body exercise.' },
  { id: 3, name: 'Plank', description: 'A core strengthening exercise.' },
  { id: 4, name: 'Lunge', description: 'A lower body exercise that targets the legs.' },
  {
    id: 5,
    name: 'Burpee',
    description: 'A full body exercise that combines a squat, push-up, and jump.',
  },
  {
    id: 6,
    name: 'Mountain Climber',
    description: 'A cardio exercise that also strengthens the core.',
  },
  { id: 7, name: 'Jumping Jack', description: 'A full body exercise that increases heart rate.' },
  {
    id: 8,
    name: 'Deadlift',
    description: 'A weightlifting exercise that targets the back and legs.',
  },
  { id: 9, name: 'Bench Press', description: 'A weightlifting exercise that targets the chest.' },
  { id: 10, name: 'Bicep Curl', description: 'An isolation exercise for the biceps.' },
];

const ExercisesPage = () => {
  return (
    <div className='p-4'>
      <ul>
        {fakeData.map((exercise) => (
          <li
            key={exercise.id}
            className='mb-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800'
          >
            <h2 className='text-xl font-semibold'>{exercise.name}</h2>
            <p className='text-gray-700 dark:text-gray-300'>{exercise.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExercisesPage;
