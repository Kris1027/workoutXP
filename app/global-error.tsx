'use client';

import { Button } from '@/components/ui/button';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full space-y-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20">
              <FaExclamationCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Application Error
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                A critical error occurred in the application. We apologize for the inconvenience.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => reset()}
                className="flex items-center gap-2"
              >
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
                variant="outline"
              >
                <FaHome className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            {/* Support Message */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please refresh the page or contact support if the issue persists.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}