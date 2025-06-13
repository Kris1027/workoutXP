import NavigationBar from '@/components/navigation/navigation-bar';
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
    <html lang='en'>
      <body>
        <ViewTransitions>
          <div className='main-container bg-white text-black dark:bg-black dark:text-white rounded-3xl overflow-hidden flex flex-col justify-between backdrop-blur-sm shadow-[0_8px_32px_0_rgba(255,255,255,0.25),0_20px_60px_0_rgba(139,69,255,0.3),0_0_0_1px_rgba(255,255,255,0.1)]'>
            <div className='main-content-scroll'>
              <main>{children}</main>
            </div>
            <NavigationBar />
          </div>
        </ViewTransitions>
      </body>
    </html>
  );
};

export default RootLayout;
