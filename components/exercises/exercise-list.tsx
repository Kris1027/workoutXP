'use client';

import { Prisma } from '@prisma/client';
import { useMemo, useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import ExerciseItem from './exercise-item';

type ExerciseListProps = {
  exercises: Prisma.ExerciseCreateInput[];
};

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Chest', 'Shoulders', 'Back', 'Legs'];

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Workout Exercises</h1>
        <p className='text-gray-600 dark:text-gray-400'>Choose your next exercise</p>
      </div>

      {/* Search Bar */}
      <div className='relative mb-6'>
        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Search exercises...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white'
        />
      </div>

      {/* Category Filter */}
      <div className='mb-6'>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {filteredExercises.map((exercise) => (
          <ExerciseItem key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <FaFilter className='text-5xl mx-auto' />
          </div>
          <p className='text-gray-500 dark:text-gray-400'>
            No exercises found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
