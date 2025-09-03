import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaHome, FaSearch, FaDumbbell } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Icon */}
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20">
          <FaSearch className="w-10 h-10 text-orange-600 dark:text-orange-400" />
        </div>

        {/* 404 Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <FaHome className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          
          <Link href="/workouts">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <FaDumbbell className="w-4 h-4" />
              Browse Workouts
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/exercises" className="text-primary hover:underline">
              Exercises
            </Link>
            <Link href="/profile" className="text-primary hover:underline">
              Profile
            </Link>
            <Link href="/about" className="text-primary hover:underline">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}