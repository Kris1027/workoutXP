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
        <main className='w-96 max-w-full min-h-[667px] p-4 bg-white text-black rounded-3xl shadow-lg overflow-hidden flex flex-col'>
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
