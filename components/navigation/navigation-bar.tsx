'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { BsListTask } from 'react-icons/bs';
import { FiUser, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { LuDumbbell } from 'react-icons/lu';
import { IconType } from 'react-icons';
import { ModeToggle } from './mode-toggle';
import { UserProps } from '@/types/data-types';
import Image from 'next/image';

type NavigationBarProps = {
  currentUser?: UserProps | null;
};

type NavLink = {
  name: string;
  href: string;
  icon: IconType | null;
  image?: string | null;
  label: string;
  description: string;
};

const getNavLinks = (currentUser?: UserProps | null) => [
  {
    name: 'Home',
    href: '/',
    icon: FiHome,
    label: 'Navigate to home page',
    description: 'Dashboard',
  },
  {
    name: 'Exercises',
    href: '/exercises',
    icon: BsListTask,
    label: 'View exercise library',
    description: 'Browse exercises',
  },
  {
    name: 'Workouts',
    href: '/workouts',
    icon: LuDumbbell,
    label: 'Browse workouts',
    description: 'Training plans',
  },
  currentUser
    ? {
        name: currentUser.name || 'User',
        href: '/profile',
        icon: null,
        image: currentUser.image,
        label: 'View your profile',
        description: 'Account',
      }
    : {
        name: 'Profile',
        href: '/profile',
        icon: FiUser,
        label: 'Access your profile',
        description: 'Sign in',
      },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [navHidden, setNavHidden] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname?.startsWith(href);

  const navLinks = getNavLinks(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add shadow on scroll
      setScrolled(currentScrollY > 10);

      // Hide/show nav on scroll (desktop only)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Restore the original overflow value on cleanup
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const DesktopNavLink = ({ link }: { link: NavLink }) => {
    const IconComponent = link.icon;
    const active = isActive(link.href);

    return (
      <Link
        href={link.href}
        aria-current={active ? 'page' : undefined}
        aria-label={link.label}
        className={`
          relative flex items-center gap-2.5 px-4 py-2 rounded-xl
          font-medium text-sm transition-all duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70
          focus-visible:ring-offset-2 focus-visible:ring-offset-background
          ${
            active
              ? 'text-primary bg-primary/10 dark:bg-primary/15 shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }
        `}
      >
        {/* Animated background */}
        {active && (
          <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl animate-pulse' />
        )}

        {/* Icon or Avatar */}
        <div className='relative z-10 flex-shrink-0'>
          {link.image ? (
            <div className='relative'>
              <Image
                src={link.image}
                alt={link.name}
                width={20}
                height={20}
                className='w-5 h-5 rounded-full object-cover ring-2 ring-background'
              />
              {active && (
                <div className='absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-background' />
              )}
            </div>
          ) : IconComponent ? (
            <IconComponent
              size={18}
              className={`transition-all duration-300 ${active ? 'text-primary' : ''}`}
              strokeWidth={active ? 2.5 : 2}
            />
          ) : null}
        </div>

        {/* Label */}
        <span className='relative z-10'>{link.name}</span>

        {/* Hover effect */}
        <div
          className={`
          absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0
          opacity-0 hover:opacity-100 transition-opacity duration-300
          ${active ? 'hidden' : ''}
        `}
        />
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        aria-label='Main Navigation'
        className={`
          hidden md:flex fixed top-0 left-0 right-0 z-50
          bg-background/70 backdrop-blur-xl border-b
          transition-all duration-500 ease-out
          ${scrolled ? 'border-border/50 shadow-lg shadow-black/5' : 'border-transparent'}
          ${navHidden ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo/Brand */}
            <Link href='/' className='flex items-center group' aria-label='WorkoutXP Home'>
              <span className='text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-500 group-hover:to-pink-500'>
                Workout
              </span>
              <span className='text-2xl font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-pink-500 group-hover:to-orange-400'>
                XP
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className='flex items-center'>
              <nav className='flex items-center space-x-1' role='navigation'>
                {navLinks.map((link) => (
                  <DesktopNavLink key={link.name} link={link} />
                ))}
              </nav>

              {/* Theme Toggle */}
              <div className='ml-6 pl-6 border-l border-border/50 flex items-center gap-3'>
                <ModeToggle />
                {/* Menu button for mobile */}
                <button
                  onClick={toggleMobileMenu}
                  className='md:hidden p-2 rounded-lg hover:bg-accent/60 transition-colors'
                  aria-label='Toggle mobile menu'
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent' />
      </nav>
      {/* Mobile Top Header */}
      <div
        className={`
        md:hidden fixed top-0 left-0 right-0 z-50
        bg-background/90 backdrop-blur-xl border-b border-border/50
        transition-all duration-500 ease-out
        ${scrolled ? 'shadow-lg shadow-black/5' : ''}
        ${navHidden && scrolled ? '-translate-y-full' : 'translate-y-0'}
      `}
      >
        <div className='flex items-center justify-between px-4 py-3'>
          <Link href='/' className='flex items-center gap-1'>
            <span className='text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Workout
            </span>
            <span className='text-xl font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent'>
              XP
            </span>
          </Link>
          <div className='flex items-center gap-2'>
            <ModeToggle />
            <button
              onClick={toggleMobileMenu}
              className='p-2 rounded-lg hover:bg-accent/60 transition-colors'
              aria-label='Toggle mobile menu'
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Slide Menu */}
      <div
        className={`
          md:hidden fixed inset-0 z-[60] transition-all duration-500 ease-out
          ${isMobileMenuOpen ? 'visible' : 'invisible'}
        `}
      >
        {/* Overlay */}
        <div
          className={`
            absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500
            ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={toggleMobileMenu}
        />

        {/* Slide Panel */}
        <div
          className={`
          absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-border/50
          shadow-2xl transition-transform duration-500 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-border/50'>
            <div className='flex items-center gap-1'>
              <span className='text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Workout
              </span>
              <span className='text-lg font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent'>
                XP
              </span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className='p-2 rounded-lg hover:bg-accent/60 transition-colors'
              aria-label='Close menu'
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <div className='p-4 space-y-2'>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent/60 text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {link.image ? (
                    <Image
                      src={link.image}
                      alt={link.name}
                      width={24}
                      height={24}
                      className='w-6 h-6 rounded-full object-cover'
                    />
                  ) : IconComponent ? (
                    <IconComponent size={20} />
                  ) : null}
                  <div className='flex-1'>
                    <div className='font-medium'>{link.name}</div>
                    <div className='text-xs opacity-70'>{link.description}</div>
                  </div>
                  {active && <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Spacer for fixed navigation */}
      <div className='h-16 hidden md:block' />
      <div className='h-14 md:hidden' /> {/* Top mobile header spacer */}
    </>
  );
};

export default NavigationBar;
