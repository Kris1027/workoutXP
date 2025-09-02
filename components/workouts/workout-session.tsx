'use client';

import { useState, useEffect, useTransition } from 'react';
import { FaCheck } from 'react-icons/fa';
import WorkoutTimer from './workout-timer';
import WorkoutProgress from './workout-progress';
import { WorkoutNavigationGuard } from './workout-navigation-guard';
import { saveWorkoutSession } from '@/actions/workout-session-actions';
import { toast } from 'sonner';

interface WorkoutSessionProps {
  children: React.ReactNode;
  workoutId?: string;
}

const WorkoutSession = ({ children, workoutId }: WorkoutSessionProps) => {
  const storageKey = workoutId ? `workout-session-${workoutId}` : 'workout-session';
  const totalExercises = Array.isArray(children) ? children.length : 0;
  
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  // Load persisted state on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(storageKey);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.isActive) {
          setIsWorkoutActive(true);
          setCompletedExercises(new Set(parsed.completedExercises || []));
        }
      } catch (e) {
        console.error('Failed to parse workout session from localStorage:', e);
      }
    }
  }, [storageKey]);

  // Save state when it changes
  useEffect(() => {
    if (isWorkoutActive) {
      localStorage.setItem(storageKey, JSON.stringify({
        isActive: true,
        completedExercises: Array.from(completedExercises),
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [isWorkoutActive, completedExercises, storageKey]);

  const handleWorkoutToggle = (active: boolean) => {
    setIsWorkoutActive(active);
    if (!active) {
      // Reset completed exercises when workout ends
      setCompletedExercises(new Set());
    }
  };

  const handleFinishWorkout = async (duration?: number) => {
    // Save workout session to database if we have all the info
    if (workoutId && duration && duration > 0) {
      startTransition(async () => {
        const result = await saveWorkoutSession(
          workoutId,
          duration,
          completedExercises.size,
          totalExercises
        );
        
        if (result.success) {
          toast.success('Workout completed! Great job! 💪');
        }
      });
    }
    
    setIsWorkoutActive(false);
    setCompletedExercises(new Set());
    // Clear localStorage
    localStorage.removeItem(storageKey);
    if (workoutId) {
      localStorage.removeItem(`workout-timer-${workoutId}`);
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
    <WorkoutNavigationGuard 
      isWorkoutActive={isWorkoutActive}
      workoutId={workoutId}
      onFinishWorkout={handleFinishWorkout}
    >
      <WorkoutTimer 
        onToggle={handleWorkoutToggle} 
        workoutId={workoutId}
        onFinish={handleFinishWorkout}
      />
      
      <WorkoutProgress 
        completedCount={completedExercises.size}
        totalCount={totalExercises}
        isActive={isWorkoutActive}
      />
      
      <div 
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        onClick={(e) => {
          if (!isWorkoutActive) return;
          
          // Check if the click was on a link, button, or their children
          const target = e.target as HTMLElement;
          const isInteractiveElement = target.closest('a, button');
          
          // Only toggle completion if not clicking on interactive elements
          if (!isInteractiveElement) {
            const exerciseCard = target.closest('[data-exercise-id]');
            if (exerciseCard) {
              const exerciseId = exerciseCard.getAttribute('data-exercise-id');
              if (exerciseId) {
                e.preventDefault();
                e.stopPropagation();
                toggleExerciseComplete(exerciseId);
              }
            }
          }
        }}
      >
        {/* Clone children and add visual indicators for completed exercises */}
        {Array.isArray(children) ? children.map((child: React.ReactElement) => {
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
    </WorkoutNavigationGuard>
  );
};

export default WorkoutSession;