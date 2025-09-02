'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkoutNavigationGuardProps {
  isWorkoutActive: boolean;
  workoutId?: string;
  onFinishWorkout: () => void;
  children: React.ReactNode;
}

export const WorkoutNavigationGuard = ({ 
  isWorkoutActive, 
  workoutId,
  onFinishWorkout,
  children 
}: WorkoutNavigationGuardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isWorkoutActive) {
        e.preventDefault();
        // Modern browsers will show their own generic message
        e.returnValue = '';
      }
    };

    if (isWorkoutActive) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isWorkoutActive]);

  // Intercept navigation attempts
  useEffect(() => {
    if (!isWorkoutActive) return;

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    const handleNavigation = (navigateFn: () => void, url?: string) => {
      // Allow navigation to exercise details within the same workout
      if (url) {
        const isExerciseInWorkout = url.includes('/exercises/') && 
          url.includes(`workoutId=${workoutId}`);
        const isSameWorkout = url.includes(`/workouts/${workoutId}`);
        
        if (isExerciseInWorkout || isSameWorkout) {
          navigateFn();
          return;
        }
      }

      // Show dialog for other navigations
      setShowDialog(true);
      setPendingNavigation(() => navigateFn);
    };

    // Override navigation methods
    router.push = (...args: Parameters<typeof router.push>) => {
      const url = typeof args[0] === 'string' ? args[0] : String(args[0]);
      if (url === pathname) return Promise.resolve(true);
      
      handleNavigation(() => originalPush.apply(router, args), url);
      return Promise.resolve(true);
    };

    router.replace = (...args: Parameters<typeof router.replace>) => {
      const url = typeof args[0] === 'string' ? args[0] : String(args[0]);
      handleNavigation(() => originalReplace.apply(router, args), url);
      return Promise.resolve(true);
    };

    router.back = () => {
      handleNavigation(() => originalBack.call(router));
    };

    router.forward = () => {
      handleNavigation(() => originalForward.call(router));
    };

    // Cleanup
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [isWorkoutActive, workoutId, pathname, router]);

  const handleConfirmNavigation = useCallback(() => {
    // Close dialog first
    setShowDialog(false);
    
    // Finish the workout (this will clear localStorage and reset state)
    onFinishWorkout();
    
    // Execute the pending navigation
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation, onFinishWorkout]);

  const handleCancelNavigation = useCallback(() => {
    setShowDialog(false);
    setPendingNavigation(null);
  }, []);

  return (
    <>
      {children}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Active Workout Session</AlertDialogTitle>
            <AlertDialogDescription>
              You have an active workout session with a running timer. 
              If you leave this page, your workout will be finished and the timer will stop. 
              Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNavigation}>
              Continue Workout
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation} className="bg-red-600 hover:bg-red-700">
              Finish Workout & Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};