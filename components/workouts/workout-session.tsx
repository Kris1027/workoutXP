'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import WorkoutTimer from './workout-timer';

interface WorkoutSessionProps {
  children: React.ReactNode;
}

const WorkoutSession = ({ children }: WorkoutSessionProps) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const handleWorkoutToggle = (active: boolean) => {
    setIsWorkoutActive(active);
    if (!active) {
      // Reset completed exercises when workout ends
      setCompletedExercises(new Set());
    }
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    if (!isWorkoutActive) return;
    
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  return (
    <>
      <WorkoutTimer onToggle={handleWorkoutToggle} />
      
      <div 
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        onClick={(e) => {
          if (!isWorkoutActive) return;
          
          // Find the closest exercise card that was clicked
          const exerciseCard = (e.target as HTMLElement).closest('[data-exercise-id]');
          if (exerciseCard) {
            const exerciseId = exerciseCard.getAttribute('data-exercise-id');
            if (exerciseId) {
              toggleExerciseComplete(exerciseId);
            }
          }
        }}
      >
        {/* Clone children and add visual indicators for completed exercises */}
        {Array.isArray(children) ? children.map((child: any) => {
          const exerciseId = child?.key;
          const isCompleted = exerciseId && completedExercises.has(exerciseId);
          
          return (
            <div 
              key={exerciseId}
              data-exercise-id={exerciseId}
              className={`relative ${isWorkoutActive ? 'cursor-pointer' : ''}`}
            >
              {child}
              {isWorkoutActive && isCompleted && (
                <>
                  <div className='absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 backdrop-blur-[2px] rounded-lg border-2 border-green-500/50 z-10' />
                  <div className='absolute top-2 right-2 z-20'>
                    <div className='bg-green-500 text-white rounded-full p-2 shadow-lg'>
                      <FaCheck className='text-lg' />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        }) : children}
      </div>
    </>
  );
};

export default WorkoutSession;