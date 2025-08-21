'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { BsListTask } from 'react-icons/bs';
import { FiUser, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { LuDumbbell } from 'react-icons/lu';
import { ModeToggle } from './mode-toggle';
import { UserProps } from '@/types/data-types';
import Image from 'next/image';

type NavigationBarProps = {
  currentUser?: UserProps | null;
};

const getNavLinks = (currentUser?: UserProps | null) => [
  { 
    name: 'Home', 
    href: '/', 
    icon: FiHome, 
    label: 'Navigate to home page',
    description: 'Dashboard' 
  },
  { 
    name: 'Exercises', 
    href: '/exercises', 
    icon: BsListTask, 
    label: 'View exercise library',
    description: 'Browse exercises' 
  },
  { 
    name: 'Workouts', 
    href: '/workouts', 
    icon: LuDumbbell, 
    label: 'Browse workouts',
    description: 'Training plans' 
  },
  currentUser
    ? { 
        name: currentUser.name || 'User', 
        href: '/profile', 
        icon: null, 
        image: currentUser.image, 
        label: 'View your profile',
        description: 'Account' 
      }
    : { 
        name: 'Profile', 
        href: '/profile', 
        icon: FiUser, 
        label: 'Access your profile',
        description: 'Sign in' 
      },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const DesktopNavLink = ({ link }: { link: any }) => {
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
          ${active 
            ? 'text-primary bg-primary/10 dark:bg-primary/15 shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }
        `}
      >
        {/* Animated background */}
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl animate-pulse" />
        )}
        
        {/* Icon or Avatar */}
        <div className="relative z-10 flex-shrink-0">
          {link.image ? (
            <div className="relative">
              <Image
                src={link.image}
                alt={link.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover ring-2 ring-background"
              />
              {active && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-background" />
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
        <span className="relative z-10">
          {link.name}
        </span>

        {/* Hover effect */}
        <div className={`
          absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0
          opacity-0 hover:opacity-100 transition-opacity duration-300
          ${active ? 'hidden' : ''}
        `} />
      </Link>
    );
  };

  const MobileNavLink = ({ link }: { link: any }) => {
    const IconComponent = link.icon;
    const active = isActive(link.href);

    return (
      <Link
        href={link.href}
        aria-current={active ? 'page' : undefined}
        aria-label={link.label}
        className={`
          relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl
          transition-all duration-300 ease-out group
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70
          ${active 
            ? 'text-primary' 
            : 'text-muted-foreground'
          }
        `}
      >
        {/* Icon container with animation */}
        <div className={`
          relative p-2 rounded-xl transition-all duration-300
          ${active 
            ? 'bg-primary/10 dark:bg-primary/15 scale-110' 
            : 'group-hover:bg-accent/60 group-active:scale-95'
          }
        `}>
          {link.image ? (
            <Image
              src={link.image}
              alt={link.name}
              width={22}
              height={22}
              className="w-5.5 h-5.5 rounded-full object-cover"
            />
          ) : IconComponent ? (
            <IconComponent 
              size={22} 
              className="transition-all duration-300"
              strokeWidth={active ? 2.5 : 2}
            />
          ) : null}
          
          {/* Active indicator dot */}
          {active && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </div>

        {/* Label */}
        <span className={`
          text-[10px] font-medium transition-all duration-300
          ${active ? 'translate-y-0 opacity-100' : 'opacity-70'}
        `}>
          {link.description || link.name}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        aria-label="Main Navigation"
        className={`
          hidden md:flex fixed top-0 left-0 right-0 z-50
          bg-background/70 backdrop-blur-xl border-b
          transition-all duration-500 ease-out
          ${scrolled ? 'border-border/50 shadow-lg shadow-black/5' : 'border-transparent'}
          ${navHidden ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
              aria-label="WorkoutXP Home"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg px-3 py-1 rounded-lg">
                  XP
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Workout
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="flex items-center">
              <nav className="flex items-center space-x-1" role="navigation">
                {navLinks.map((link) => (
                  <DesktopNavLink key={link.name} link={link} />
                ))}
              </nav>
              
              {/* Theme Toggle */}
              <div className="ml-6 pl-6 border-l border-border/50 flex items-center gap-3">
                <ModeToggle />
                {/* Menu button for mobile */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-accent/60 transition-colors"
                  aria-label="Toggle mobile menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav 
        aria-label="Mobile Navigation"
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-50
          bg-background/90 backdrop-blur-xl border-t border-border/50
          transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-y-full' : 'translate-y-0'}
        `}
      >
        {/* Floating pill indicator */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-background/90 backdrop-blur-xl rounded-full border border-border/50 shadow-lg">
          <div className="flex gap-1">
            {navLinks.map((_, index) => (
              <div 
                key={index}
                className={`
                  w-1 h-1 rounded-full transition-all duration-300
                  ${isActive(navLinks[index].href) ? 'w-4 bg-primary' : 'bg-muted-foreground/30'}
                `}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {navLinks.map((link) => (
            <MobileNavLink key={link.name} link={link} />
          ))}
          
          {/* Theme toggle for mobile */}
          <div className="flex flex-col items-center gap-1 px-3 py-2">
            <div className="p-2 rounded-xl">
              <ModeToggle />
            </div>
            <span className="text-[10px] font-medium opacity-70">
              Theme
            </span>
          </div>
        </div>
      </nav>

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
        <div className={`
          absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-border/50
          shadow-2xl transition-transform duration-500 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-accent/60 transition-colors"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="p-4 space-y-2">
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
                    ${active 
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
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : IconComponent ? (
                    <IconComponent size={20} />
                  ) : null}
                  <div className="flex-1">
                    <div className="font-medium">{link.name}</div>
                    <div className="text-xs opacity-70">{link.description}</div>
                  </div>
                  {active && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16 hidden md:block" />
      <div className="h-20 md:hidden" />

      {/* Add custom styles */}
      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default NavigationBar;