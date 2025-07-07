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

  // Show a neutral state during SSR and initial hydration
  if (!mounted) {
    return (
      <Button variant='outline' size='icon' aria-label='Toggle theme'>
        <Sun className='h-[1.2rem] w-[1.2rem]' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button variant='outline' size='icon' onClick={toggleTheme} aria-label='Toggle theme'>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
        }`}
      />
      <Monitor
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === 'system' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
        }`}
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
