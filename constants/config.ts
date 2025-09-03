/**
 * Application configuration constants
 * These values can be overridden by environment variables
 */

export const APP_CONFIG = {
  // Application Info
  APP_NAME: 'WorkoutXP',
  APP_DESCRIPTION: 'Transform Your Fitness Journey',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Support & Contact
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@workoutxp.com',
  SUPPORT_PHONE: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '',
  
  // Social Media
  GITHUB_URL: 'https://github.com/Kris1027/workoutXP',
  TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL || '',
  LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  
  // Features Config
  ENABLE_GITHUB_LOGIN: process.env.NEXT_PUBLIC_ENABLE_GITHUB_LOGIN !== 'false',
  ENABLE_SOCIAL_FEATURES: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_FEATURES !== 'false',
  
  // Limits
  MAX_FILE_SIZE_MB: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || '5', 10),
  MAX_EXERCISES_PER_WORKOUT: parseInt(process.env.NEXT_PUBLIC_MAX_EXERCISES_PER_WORKOUT || '20', 10),
  
  // Feature Flags
  SHOW_NEW_BADGE_DAYS: parseInt(process.env.NEXT_PUBLIC_SHOW_NEW_BADGE_DAYS || '7', 10),
} as const;

export type AppConfig = typeof APP_CONFIG;