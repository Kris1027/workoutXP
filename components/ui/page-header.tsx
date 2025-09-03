import { cn } from '@/lib/utils';
import React from 'react';

const gradientMap = {
  blue: 'from-blue-600 via-blue-500 to-indigo-600',
  purple: 'from-purple-600 via-purple-500 to-pink-600',
  orange: 'from-orange-600 via-orange-500 to-red-600',
  green: 'from-green-600 via-green-500 to-teal-600',
  red: 'from-red-600 via-red-500 to-pink-600',
} as const;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  gradient?: keyof typeof gradientMap;
  className?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  icon,
  actions,
  badge,
  gradient = 'blue',
  className,
  stats,
}) => {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 lg:p-10 mb-8', className)}>
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          'absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br opacity-20 blur-3xl',
          gradientMap[gradient]
        )} />
        <div className={cn(
          'absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr opacity-20 blur-3xl',
          gradientMap[gradient]
        )} />
      </div>

      {/* Main Header Content */}
      <div className="relative">
        <div className="mb-6">
          {/* Top Section with Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            <div className="flex-1">
              {/* Title Section */}
              <div className="flex items-center gap-4 mb-3">
                {icon && (
                  <div className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg',
                    gradientMap[gradient]
                  )}>
                    <div className="text-white text-2xl">
                      {icon}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white supports-[background-clip:text]:bg-gradient-to-r supports-[background-clip:text]:from-gray-900 supports-[background-clip:text]:to-gray-600 dark:supports-[background-clip:text]:from-white dark:supports-[background-clip:text]:to-gray-400 supports-[background-clip:text]:bg-clip-text supports-[background-clip:text]:text-transparent">
                      {title}
                    </h1>
                    {badge && badge}
                  </div>
                  {subtitle && (
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {description && (
                <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                  {description}
                </p>
              )}

              {/* Stats Section */}
              {stats && stats.length > 0 && (
                <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 mt-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 dark:border-gray-700/50">
                      {stat.icon && (
                        <div className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800',
                          stat.color
                        )}>
                          {stat.icon}
                        </div>
                      )}
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Section */}
            {actions && (
              <div className="flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;