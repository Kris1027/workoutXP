'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Exercises', href: '/exercises' },
  { name: 'Workouts', href: '/workouts' },
  { name: 'Profile', href: '/profile' },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav>
      <ul className='flex justify-around items-center bg-gray-800 text-white p-4 rounded-lg'>
        {navLinks.map((link) => (
          <li key={link.name} className={isActive(link.href) ? 'text-violet-400' : ''}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
