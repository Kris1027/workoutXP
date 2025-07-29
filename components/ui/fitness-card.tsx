'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from './card';
import { ReactNode } from 'react';

interface FitnessCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  
  // Theme configuration
  theme: 'orange' | 'blue'; // orange for exercises, blue for workouts
  
  // Badges (top overlay)
  leftBadge?: {
    text: string;
    className?: string;
  };
  rightBadge?: {
    text: string;
    className?: string;
  };
  
  // Content below image
  metadata?: ReactNode; // creator info, date, etc.
  actionComponent?: ReactNode; // like button, etc.
  actionText?: string; // "View Exercise" or "View Workout"
  
  // Admin controls
  adminControls?: ReactNode;
  
  // Optional custom styling
  className?: string;
  imageHeight?: 'h-56' | 'h-64'; // different heights for different card types
}

const FitnessCard: React.FC<FitnessCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  imageAlt,
  href,
  theme,
  leftBadge,
  rightBadge,
  metadata,
  actionComponent,
  actionText = 'View',
  adminControls,
  className = '',
  imageHeight = 'h-64'
}) => {
  // Theme-based styling
  const themeStyles = {
    orange: {
      cardHover: 'hover:border-orange-500/50 hover:shadow-orange-500/10',
      overlay: 'from-black/80 via-black/30 to-transparent dark:from-black dark:via-black/50 dark:to-transparent',
      titleHover: 'group-hover:text-orange-400',
      actionColor: 'text-orange-600 dark:text-orange-500'
    },
    blue: {
      cardHover: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
      overlay: 'from-blue-900/80 via-blue-900/30 to-transparent dark:from-blue-900/90 dark:via-blue-900/40 dark:to-transparent',
      titleHover: 'group-hover:text-blue-400',
      actionColor: 'text-blue-600 dark:text-blue-400'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <Card 
      key={id} 
      className={`group relative overflow-hidden bg-white dark:bg-black/90 border border-gray-200 dark:border-gray-800 ${currentTheme.cardHover} transition-all duration-500 ease-out hover:shadow-2xl p-0 ${className}`}
    >
      {/* Image with overlay */}
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <Link href={href} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={0}
            height={0}
            sizes='100vw'
            className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
            priority
          />
        </Link>
        
        {/* Overlay for better text readability */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentTheme.overlay}`} />
        
        {/* Left badge */}
        {leftBadge && (
          <div className='absolute top-3 left-3'>
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-lg ${leftBadge.className || 'bg-gray-800 text-white'}`}>
              {leftBadge.text}
            </span>
          </div>
        )}

        {/* Right badge */}
        {rightBadge && (
          <div className='absolute top-3 right-3'>
            <span className={`px-2 py-1 text-xs font-semibold uppercase tracking-wider rounded shadow-lg ${rightBadge.className || 'bg-white/90 text-gray-900'}`}>
              {rightBadge.text}
            </span>
          </div>
        )}

        {/* Title overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <Link href={href} className="block">
            <h3 className={`text-white font-bold text-lg leading-tight ${currentTheme.titleHover} transition-colors duration-500 ease-out`}>
              {title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Content section */}
      <CardContent className='p-4'>
        <Link href={href} className="block">
          <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-3 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300'>
            {description}
          </p>
        </Link>
        
        {/* Metadata section */}
        {metadata && (
          <div className='mb-3'>
            {metadata}
          </div>
        )}

        {/* Bottom row with action component and action indicator */}
        <div className='flex items-center justify-between'>
          {actionComponent && (
            <div>
              {actionComponent}
            </div>
          )}
          
          {/* Action indicator */}
          <Link href={href} className={`flex items-center ${currentTheme.actionColor} text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out hover:underline ${!actionComponent ? 'ml-auto' : ''}`}>
            <span>{actionText}</span>
            <svg className='w-3 h-3 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>
      </CardContent>

      {/* Admin controls at bottom */}
      {adminControls && (
        <div className='flex justify-between items-center p-3'>
          {adminControls}
        </div>
      )}
    </Card>
  );
};

export default FitnessCard;