'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Only render after hydration to avoid SSR mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'system':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System mode';
      default:
        return 'Toggle theme';
    }
  };

  // Show a neutral state during SSR and initial hydration
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Toggle theme"
        className="relative h-9 w-9 rounded-lg transition-colors hover:bg-accent/50"
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label={getThemeLabel()}
      className="relative h-9 w-9 rounded-lg transition-all duration-200 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <div className="transition-transform duration-200 hover:scale-110">
        {getThemeIcon()}
      </div>
      <span className="sr-only">{getThemeLabel()}</span>
    </Button>
  );
}
