'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LiaTimesSolid } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  active?: string;
  isHome?: boolean;
  isWhite?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isHome = false, isWhite = false, active = '' }) => {
  const [nav, setNav] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: 'about' },
    { name: 'Resources', path: 'resources' },
    { name: 'Projects', path: 'projects' },
    { name: 'Blog', path: 'blogs' },
    { name: 'Podcast', path: 'podcast' },
    { name: 'Contact', path: 'contacts' },
  ];

  const handleClick = () => setNav(!nav);

  // Fixed header classes to respond to dark mode
  const headerClasses = isHome
    ? `absolute w-full left-0 top-0 backdrop-blur-md shadow-md z-50 ${
        isDark ? 'bg-gray-900/95' : 'bg-white/95'
      }`
    : `backdrop-blur-md shadow-md z-50 ${
        isDark ? 'bg-gray-900/95' : 'bg-white/95'
      }`;

  const textClasses = isWhite 
    ? 'text-white hover:text-gray-200' 
    : isDark 
      ? 'text-gray-100 hover:text-gray-300' 
      : 'text-green-600 hover:text-green-700';

  const mobileMenuClasses = isWhite
    ? 'bg-white/95 backdrop-blur-md text-gray-800'
    : isDark
      ? 'bg-gray-900/95 backdrop-blur-md text-gray-100'
      : 'bg-white/95 backdrop-blur-md text-gray-800';

  return (
    <nav className={headerClasses}>
      <div className="w-full container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo - FIXED VERSION */}
        <Link href="/" className="font-mona text-sm font-bold capitalize">
          {/* Option 1: Use different logos for dark/light mode */}
          {isDark ? (
            <Image
              src="/images/whiteLogo.svg" // Use white version for dark mode
              alt="LERA Communications Logo"
              width={120}
              height={40}
            />
          ) : (
            <Image
              src="/images/lera.svg" // Use colored version for light mode
              alt="LERA Communications Logo"
              width={120}
              height={40}
            />
          )}
          
          {/* Option 2: If you want to keep single logo without color change */}
          {/*
          <Image
            src="/images/coloredLogo.svg"
            alt="LERA Communications Logo"
            width={120}
            height={40}
            // Removed className="dark:invert" to prevent color inversion
          />
          */}
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-sm font-light">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={`/${item.path}`}
                className={`font-mona text-sm font-bold capitalize transition-colors duration-200 ${
                  active === item.path 
                    ? `border-b-2 border-b-green-600 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }` 
                    : textClasses
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              isWhite 
                ? 'text-white hover:text-gray-200' 
                : isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isWhite 
                  ? 'text-white hover:text-gray-200' 
                  : isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className={`p-2 rounded-lg transition-all duration-300 ${
                isWhite 
                  ? 'text-white hover:text-gray-200' 
                  : textClasses
              }`}
              onClick={handleClick}
            >
              {!nav ? (
                <RxHamburgerMenu size={20} />
              ) : (
                <LiaTimesSolid size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`${
          !nav ? 'hidden' : 'absolute w-full px-6 py-8 z-40'
        } ${mobileMenuClasses} shadow-lg border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {menuItems.map((item, index) => (
          <li key={index} className="mb-4">
            <Link
              href={`/${item.path}`}
              className={`font-mona text-base font-bold capitalize transition-colors duration-200 ${
                active === item.path 
                  ? `border-b-2 border-b-green-600 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }` 
                  : isDark 
                    ? 'text-gray-100 hover:text-green-400' 
                    : 'text-gray-800 hover:text-green-600'
              }`}
              onClick={() => setNav(false)}
            >
              {item.name}
            </Link>
          </li>
        ))}
        {/* Mobile Theme Toggle in Menu */}
        <li className={`mt-4 pt-4 border-t ${
          isDark ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <button
            onClick={() => {
              toggleTheme();
              setNav(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'text-gray-100 hover:bg-gray-700' 
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;