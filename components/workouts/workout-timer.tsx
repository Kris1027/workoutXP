'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';

interface WorkoutTimerProps {
  onToggle?: (isActive: boolean) => void;
}

const WorkoutTimer = ({ onToggle }: WorkoutTimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
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
  }, [isRunning]);

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
      setIsRunning(false);
      setSeconds(0);
      onToggle?.(false);
    } else {
      setIsRunning(true);
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