'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';

interface WorkoutTimerProps {
  onToggle?: (isActive: boolean) => void;
  workoutId?: string;
  onFinish?: (duration: number) => void;
}

const WorkoutTimer = ({ onToggle, workoutId, onFinish }: WorkoutTimerProps) => {
  const storageKey = workoutId ? `workout-timer-${workoutId}` : 'workout-timer';
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load persisted timer state on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem(storageKey);
    if (savedTimer) {
      try {
        const parsed = JSON.parse(savedTimer);
        if (parsed.isRunning && parsed.startTime) {
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          setSeconds(elapsed);
          setStartTime(parsed.startTime);
          setIsRunning(true);
          onToggle?.(true);
        }
      } catch (e) {
        console.error('Failed to load timer state:', e);
      }
    }
  }, [storageKey, onToggle]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setSeconds(elapsed);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  // Save/clear timer state when running state changes
  useEffect(() => {
    if (isRunning && startTime) {
      localStorage.setItem(storageKey, JSON.stringify({
        startTime: startTime,
        isRunning: true
      }));
    } else if (!isRunning) {
      localStorage.removeItem(storageKey);
    }
  }, [isRunning, startTime, storageKey]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(hours.toString().padStart(2, '0'));
    }
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));

    return parts.join(':');
  };

  const handleToggle = () => {
    if (isRunning) {
      const finalDuration = seconds;
      setIsRunning(false);
      setSeconds(0);
      setStartTime(null);
      onToggle?.(false);
      onFinish?.(finalDuration);
    } else {
      const now = Date.now();
      setStartTime(now);
      setIsRunning(true);
      setSeconds(0);
      onToggle?.(true);
    }
  };

  return (
    <div className='flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6'>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isRunning ? (
          <>
            <FaStop className='text-lg' />
            Finish Workout
          </>
        ) : (
          <>
            <FaPlay className='text-lg' />
            Start Workout
          </>
        )}
      </button>
      
      <div className='text-2xl font-mono font-bold text-gray-700 dark:text-gray-300'>
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default WorkoutTimer;