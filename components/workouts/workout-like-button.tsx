'use client';

import { toggleWorkoutLike } from '@/actions/workout-like-actions';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'sonner';

interface WorkoutLikeButtonProps {
  workoutId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  isAuthenticated: boolean;
}

const WorkoutLikeButton: React.FC<WorkoutLikeButtonProps> = ({
  workoutId,
  initialIsLiked,
  initialLikeCount,
  isAuthenticated,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like workouts');
      return;
    }

    startTransition(async () => {
      try {
        const result = await toggleWorkoutLike(workoutId);
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
        
        if (result.isLiked) {
          toast.success('Workout liked!');
        } else {
          toast.success('Workout unliked!');
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to update like. Please try again.'
        );
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isPending}
      className="flex items-center gap-2 text-sm"
    >
      {isLiked ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
      <span className={isLiked ? 'text-red-500' : 'text-gray-500'}>
        {likeCount}
      </span>
    </Button>
  );
};

export default WorkoutLikeButton;