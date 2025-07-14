import Navigation from '@/components/navigation/navigation';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/utils/theme-provider';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import './globals.css';

export const metadata: Metadata = {
  title: 'workoutXP',
  description: 'Earn XP, Build Strength',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ViewTransitions>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </ViewTransitions>
      </body>
    </html>
  );
};

export default RootLayout;
