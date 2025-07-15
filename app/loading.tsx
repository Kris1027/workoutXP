'use client';

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-black'>
      {/* Main loading container */}
      <div className='relative z-10 text-center'>
        {/* Logo/Brand */}
        <div className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight'>
            workout
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500'>
              XP
            </span>
          </h1>
          <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full'></div>
        </div>

        {/* Advanced loading animation */}
        <div className='relative mb-8'>
          {/* Outer rotating ring */}
          <div className='w-32 h-32 border-4 border-purple-500/30 dark:border-purple-500/30 rounded-full animate-spin mx-auto relative'>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <div className='w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
            </div>
          </div>

          {/* Inner pulsing core */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-60'></div>
          </div>

          {/* Middle rotating ring - opposite direction */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div
              className='w-24 h-24 border-2 border-blue-400/40 dark:border-blue-400/40 rounded-full animate-spin-reverse'
              style={{ animationDuration: '3s' }}
            >
              <div className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2'>
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className='w-64 h-1 bg-gray-200 dark:bg-white/20 rounded-full mx-auto mb-6 overflow-hidden'>
          <div className='h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse origin-left transform scale-x-75'></div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className='text-gray-700 dark:text-white/80 text-lg font-medium mb-4'>
          <span className='inline-block animate-pulse'>Preparing your workout experience</span>
          <span className='inline-block animate-bounce ml-1'>.</span>
          <span className='inline-block animate-bounce ml-1' style={{ animationDelay: '0.2s' }}>
            .
          </span>
          <span className='inline-block animate-bounce ml-1' style={{ animationDelay: '0.4s' }}>
            .
          </span>
        </div>

        {/* Stats preview */}
        <div className='flex justify-center space-x-6 text-gray-500 dark:text-white/60 text-sm'>
          <div className='flex items-center space-x-1'>
            <div className='w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse'></div>
            <span>Muscles Ready</span>
          </div>
          <div className='flex items-center space-x-1'>
            <div
              className='w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.5s' }}
            ></div>
            <span>Form Check</span>
          </div>
          <div className='flex items-center space-x-1'>
            <div
              className='w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse'
              style={{ animationDelay: '1s' }}
            ></div>
            <span>XP Loading</span>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-60'></div>

      {/* Custom styles for reverse spin */}
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
