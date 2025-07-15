'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';

import { BsListTask } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { HiOutlineHomeModern } from 'react-icons/hi2';
import { LuDumbbell } from 'react-icons/lu';
import { ModeToggle } from './mode-toggle';
import { UserProps } from '@/types/data-types';
import Image from 'next/image';

type NavigationBarProps = {
  currentUser?: UserProps | null;
};

const getNavLinks = (currentUser?: UserProps | null) => [
  { name: 'Home', href: '/', icon: HiOutlineHomeModern },
  { name: 'Exercises', href: '/exercises', icon: BsListTask },
  { name: 'Workouts', href: '/workouts', icon: LuDumbbell },
  currentUser
    ? { name: currentUser.name || 'User', href: '/profile', icon: null, image: currentUser.image }
    : { name: 'Profile', href: '/profile', icon: FiUser },
  { name: 'Theme', href: '#', icon: ModeToggle, isComponent: true },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname?.startsWith(href);

  const navLinks = getNavLinks(currentUser);

  return (
    <nav
      aria-label='Main Navigation'
      className='bg-gray-100 dark:bg-gray-800 w-full sticky bottom-0 z-10 flex justify-between border-t border-gray-300 dark:border-gray-700'
    >
      <ul className='flex justify-around items-center p-1 flex-1'>
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const active = isActive(link.href);

          return (
            <li key={link.name}>
              {link.isComponent ? (
                <div className='flex flex-col items-center justify-center py-2 px-1'>
                  {IconComponent && typeof IconComponent === 'function' && <IconComponent />}
                  <span className='text-xs mt-1 font-medium text-gray-700 dark:text-gray-400'>
                    {link.name}
                  </span>
                </div>
              ) : link.image ? (
                <Link
                  aria-current={active ? 'page' : undefined}
                  href={link.href}
                  className={`flex flex-col items-center justify-center h-full py-2 px-1 transition-colors duration-200 group ${
                    active
                      ? 'text-violet-700 dark:text-violet-400'
                      : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Image
                    src={link.image}
                    alt={link.name}
                    width={28}
                    height={28}
                    className={`rounded-full w-7 h-7 object-cover border-2 ${
                      active
                        ? 'border-violet-700 dark:border-violet-400'
                        : 'border-gray-400 dark:border-gray-400 group-hover:border-gray-900 dark:group-hover:border-white'
                    }`}
                  />
                  <span
                    className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                      active
                        ? 'text-violet-700 dark:text-violet-400'
                        : 'text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              ) : (
                <Link
                  aria-current={active ? 'page' : undefined}
                  href={link.href}
                  className={`flex flex-col items-center justify-center h-full py-2 px-1 transition-colors duration-200 group ${
                    active
                      ? 'text-violet-700 dark:text-violet-400'
                      : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {IconComponent && (
                    <IconComponent
                      size={24}
                      className={`transition-colors duration-200 ${
                        active
                          ? 'text-violet-700 dark:text-violet-400'
                          : 'text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}
                    />
                  )}
                  <span
                    className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                      active
                        ? 'text-violet-700 dark:text-violet-400'
                        : 'text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavigationBar;
