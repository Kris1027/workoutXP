'use client';

import { useMemo, useState } from 'react';
import { FaStar, FaFilter, FaSearch } from 'react-icons/fa';

const ExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      category: 'Chest',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      rating: 4.8,
      description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    },
    {
      id: 2,
      name: 'Squats',
      category: 'Legs',
      difficulty: 'Beginner',
      image:
        'https://images.unsplash.com/photo-1649887974297-4be052375a67?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      rating: 4.9,
      description: 'Fundamental lower body movement targeting quads and glutes',
    },
    {
      id: 3,
      name: 'Deadlifts',
      category: 'Back',
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      rating: 4.7,
      description: 'Compound movement for posterior chain strength',
    },
    {
      id: 4,
      name: 'Plank',
      category: 'Core',
      difficulty: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      rating: 4.6,
      description: 'Isometric core exercise for stability and strength',
    },
    {
      id: 5,
      name: 'Pull-ups',
      category: 'Back',
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
      rating: 4.8,
      description: 'Upper body pulling exercise for lats and biceps',
    },
    {
      id: 6,
      name: 'Burpees',
      category: 'Cardio',
      difficulty: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      rating: 4.3,
      description: 'Full-body explosive movement for conditioning',
    },
  ];

  const categories = ['All', 'Chest', 'Legs', 'Back', 'Core', 'Cardio'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
          <div
            key={exercise.id}
            className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col'
          >
            {/* Image at the top, full width */}
            <div className='w-full h-40 sm:h-48'>
              <img
                src={exercise.image}
                alt={exercise.name}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Content below image */}
            <div className='flex-1 p-4 flex flex-col justify-between'>
              <div>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    {exercise.name}
                  </h3>
                  <div className='flex items-center gap-1'>
                    <FaStar className='text-yellow-400' />
                    <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                      {exercise.rating}
                    </span>
                  </div>
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                  {exercise.description}
                </p>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-wrap gap-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {exercise.difficulty}
                  </span>
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium'>
                    {exercise.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
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

export default ExercisesPage;
