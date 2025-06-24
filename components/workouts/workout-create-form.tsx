'use client';

import { useState } from 'react';
import Form from 'next/form';
import { FaSearch, FaPlus, FaMinus, FaDumbbell } from 'react-icons/fa';
import WorkoutList from '@/components/workouts/workout-list';
import { ExerciseProps, WorkoutProps } from '@/types/data-types';

interface WorkoutCreationFormProps {
  exercises: ExerciseProps[];
  createWorkout: (formData: FormData) => Promise<void>;
  existingWorkouts: WorkoutProps[];
}

const WorkoutCreationForm = ({
  exercises,
  createWorkout,
  existingWorkouts,
}: WorkoutCreationFormProps) => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Filter exercises based on search and category
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || exercise.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(exercises.map((exercise) => exercise.category))];

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const handleSubmit = async (formData: FormData) => {
    // Add selected exercises to form data
    selectedExercises.forEach((exerciseId) => {
      formData.append('exercises', exerciseId);
    });

    await createWorkout(formData);

    // Reset form
    setSelectedExercises([]);
    setShowForm(false);
  };

  return (
    <div className='space-y-8'>
      {/* Toggle Create Form Button */}
      <div className='flex justify-between items-center'>
        <button
          onClick={() => setShowForm(!showForm)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors'
        >
          <FaPlus className={`transition-transform ${showForm ? 'rotate-45' : ''}`} />
          {showForm ? 'Cancel' : 'Create New Workout'}
        </button>
      </div>

      {/* Workout Creation Form */}
      {showForm && (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
          <Form action={handleSubmit} className='space-y-6'>
            {/* Basic Workout Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Workout Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  required
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                  placeholder='Enter workout name'
                />
              </div>

              <div>
                <label
                  htmlFor='imageUrl'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Image URL (Optional)
                </label>
                <input
                  type='url'
                  id='imageUrl'
                  name='imageUrl'
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                  placeholder='https://example.com/image.jpg'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                required
                rows={3}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                placeholder='Describe your workout'
              />
            </div>

            {/* Exercise Selection */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Select Exercises ({selectedExercises.length} selected)
              </h3>

              {/* Search and Filter */}
              <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                <div className='relative flex-1'>
                  <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search exercises...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                >
                  <option value=''>All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exercise Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedExercises.includes(exercise.id!)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => toggleExerciseSelection(exercise.id!)}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='font-medium text-gray-900 dark:text-white text-sm'>
                        {exercise.name}
                      </h4>
                      {selectedExercises.includes(exercise.id!) ? (
                        <FaMinus className='text-red-500 text-sm' />
                      ) : (
                        <FaPlus className='text-green-500 text-sm' />
                      )}
                    </div>

                    <div className='flex items-center gap-2 mb-2'>
                      <FaDumbbell className='text-gray-400 text-xs' />
                      <span className='text-xs text-gray-600 dark:text-gray-400'>
                        {exercise.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          exercise.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : exercise.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {exercise.difficulty}
                      </span>
                    </div>

                    <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2'>
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>

              {filteredExercises.length === 0 && (
                <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                  No exercises found matching your criteria
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='flex justify-end gap-4'>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={selectedExercises.length === 0}
                className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors'
              >
                Create Workout ({selectedExercises.length} exercises)
              </button>
            </div>
          </Form>
        </div>
      )}

      {/* Existing Workouts */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Your Workouts</h2>
        <WorkoutList workouts={existingWorkouts} />
      </div>
    </div>
  );
};

export default WorkoutCreationForm;
