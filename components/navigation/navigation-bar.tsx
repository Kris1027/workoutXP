'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HiOutlineHomeModern } from 'react-icons/hi2';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { FaPeopleRobbery } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', href: '/', icon: HiOutlineHomeModern },
  { name: 'Exercises', href: '/exercises', icon: MdOutlineEmojiPeople },
  { name: 'Workouts', href: '/workouts', icon: FaPeopleRobbery },
  { name: 'Profile', href: '/profile', icon: FiUser },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className='bg-gray-800'>
      <ul className='flex justify-around items-center p-1'>
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const active = isActive(link.href);

          return (
            <li key={link.name} className='flex-1'>
              <Link
                href={link.href}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors duration-200 group ${
                  active ? 'text-violet-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent
                  size={24}
                  className={`transition-colors duration-200 ${
                    active ? 'text-violet-400' : 'text-gray-400 group-hover:text-white'
                  }`}
                />
                <span
                  className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                    active ? 'text-violet-400' : 'text-gray-400 group-hover:text-white'
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavigationBar;
