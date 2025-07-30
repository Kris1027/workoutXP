'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { BsListTask } from 'react-icons/bs';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineHomeModern } from 'react-icons/hi2';
import { LuDumbbell } from 'react-icons/lu';
import { ModeToggle } from './mode-toggle';
import { UserProps } from '@/types/data-types';
import Image from 'next/image';

type NavigationBarProps = {
  currentUser?: UserProps | null;
};

const getNavLinks = (currentUser?: UserProps | null) => [
  { name: 'Home', href: '/', icon: HiOutlineHomeModern, label: 'Navigate to home page' },
  { name: 'Exercises', href: '/exercises', icon: BsListTask, label: 'View exercise library' },
  { name: 'Workouts', href: '/workouts', icon: LuDumbbell, label: 'Browse workouts' },
  currentUser
    ? { name: currentUser.name || 'User', href: '/profile', icon: null, image: currentUser.image, label: 'View your profile' }
    : { name: 'Profile', href: '/profile', icon: FiUser, label: 'Access your profile' },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname?.startsWith(href);

  const navLinks = getNavLinks(currentUser);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ link, className = '', onClick }: { link: any; className?: string; onClick?: () => void }) => {
    const IconComponent = link.icon;
    const active = isActive(link.href);

    return (
      <Link
        href={link.href}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        aria-label={link.label}
        className={`
          group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-all duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
          ${active 
            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }
          ${className}
        `}
      >
        {/* Active indicator */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full md:hidden" />
        )}
        
        {/* Icon or Avatar */}
        <div className="relative flex-shrink-0">
          {link.image ? (
            <div className={`relative ${active ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} rounded-full`}>
              <Image
                src={link.image}
                alt={link.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
          ) : IconComponent ? (
            <IconComponent 
              size={20} 
              className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
            />
          ) : null}
        </div>

        {/* Label */}
        <span className={`font-medium transition-colors duration-200 ${isMobile ? 'text-xs truncate max-w-[3rem]' : ''}`}>
          {link.name}
        </span>

        {/* Active dot for mobile */}
        {active && isMobile && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full md:hidden" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        aria-label="Main Navigation"
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                WorkoutXP
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink key={link.name} link={link} className="px-4 py-2" />
              ))}
              <div className="ml-4 pl-4 border-l border-border/50">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50"
      >
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {navLinks.map((link) => (
            <div key={link.name} className="flex-1 flex justify-center">
              <NavLink 
                link={link} 
                className="flex-col gap-1 px-2 py-1.5 min-w-0 w-full max-w-[4rem] text-center mobile-nav-item"
                onClick={closeMobileMenu}
              />
            </div>
          ))}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center gap-1 px-2 py-1.5 mobile-nav-item">
              <ModeToggle />
              <span className="text-xs font-medium text-muted-foreground truncate">Theme</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (for future hamburger menu if needed) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Spacer for fixed navigation */}
      <div className="h-16 hidden md:block" />
      <div className="h-20 md:hidden" />
    </>
  );
};

export default NavigationBar;
