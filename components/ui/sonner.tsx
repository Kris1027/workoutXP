'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='top-center'
      expand={true}
      richColors
      closeButton
      duration={4000}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'group-[.toaster]:shadow-lg',
          error: 'group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 dark:group-[.toaster]:bg-red-900/20 dark:group-[.toaster]:text-red-400',
          success: 'group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 dark:group-[.toaster]:bg-green-900/20 dark:group-[.toaster]:text-green-400',
          warning: 'group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-900 dark:group-[.toaster]:bg-yellow-900/20 dark:group-[.toaster]:text-yellow-400',
          info: 'group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 dark:group-[.toaster]:bg-blue-900/20 dark:group-[.toaster]:text-blue-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
