import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Exercises', href: 'exercises' },
  { name: 'Workouts', href: 'workouts' },
  { name: 'Profile', href: 'profile' },
];

const NavigationBar = () => {
  return (
    <nav>
      <ul className='flex justify-around items-center bg-gray-800 text-white p-4 rounded-lg'>
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
