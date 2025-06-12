import type { Metadata } from 'next';
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
      <body className='min-h-screen flex justify-center items-center'>
        <main className='relative z-10 w-96 max-w-full min-h-[667px] p-4 bg-white text-black rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm shadow-[0_8px_32px_0_rgba(255,255,255,0.25),0_20px_60px_0_rgba(139,69,255,0.3),0_0_0_1px_rgba(255,255,255,0.1)]'>
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
