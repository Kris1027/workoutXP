'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  // Determine error type and message
  const getErrorMessage = () => {
    // Check for common error patterns
    if (error.message?.includes('auth') || error.message?.includes('login')) {
      return {
        title: 'Authentication Error',
        message: 'There was a problem with your login. Please try signing in again.',
        showHome: true,
      };
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        showHome: false,
      };
    }
    
    if (error.message?.includes('permission') || error.message?.includes('access')) {
      return {
        title: 'Access Denied',
        message: 'You don\'t have permission to access this resource.',
        showHome: true,
      };
    }

    // Default error message for production
    if (process.env.NODE_ENV === 'production') {
      return {
        title: 'Something went wrong',
        message: 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
        showHome: true,
      };
    }

    // Show detailed error in development
    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred',
      showHome: true,
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20">
          <FaExclamationTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {errorInfo.message}
          </p>

          {/* Error Code (if available) */}
          {error.digest && process.env.NODE_ENV !== 'production' && (
            <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
              Error Code: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="flex items-center gap-2"
            variant="default"
          >
            <FaRedo className="w-4 h-4" />
            Try Again
          </Button>
          
          {errorInfo.showHome && (
            <Button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
              variant="outline"
            >
              <FaHome className="w-4 h-4" />
              Go Home
            </Button>
          )}
        </div>

        {/* Support Message */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please{' '}
            <a href="mailto:support@workoutxp.com" className="text-primary hover:underline">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}