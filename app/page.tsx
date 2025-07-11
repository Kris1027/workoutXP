import Image from 'next/image';

const HomePage = async () => {
  const logoUrl = process.env.LOGO_URL || '';

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='relative w-full max-w-md md:max-w-lg lg:max-w-xl'>
        <Image
          src={logoUrl}
          width={400}
          height={400}
          alt='workoutXP logo'
          className='w-full h-auto object-contain'
          priority
        />
      </div>
    </div>
  );
};

export default HomePage;
