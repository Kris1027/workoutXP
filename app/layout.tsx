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
      <body className="min-h-screen bg-background font-sans antialiased">
        <ViewTransitions>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1 px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto w-full">
                {children}
              </main>
              <Toaster />
            </div>
          </ThemeProvider>
        </ViewTransitions>
      </body>
    </html>
  );
};

export default RootLayout;
