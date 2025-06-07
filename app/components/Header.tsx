// app/components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LiaTimesSolid } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';

interface HeaderProps {
  active?: string;
  isHome?: boolean;
  isWhite?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isHome = false, isWhite = false, active = '' }) => {
  const [nav, setNav] = useState(false);
  
  const menuItems = [
    { name: 'Home', path: 'home' },
    { name: 'About Us', path: 'about' },
    { name: 'Resources', path: 'resources' },
    { name: 'Projects', path: 'projects' },
    { name: 'Blog', path: 'blogs' },
    { name: 'Contact', path: 'contacts' },
  ];

  const handleClick = () => setNav(!nav);

  return (
    <nav
      className={`${
        isHome
          ? 'absolute w-full left-0 top-0 text-green-600 bg-white shadow-md z-50'
          : 'bg-white text-green-600 shadow-md'
      }`}
    >
      <div className="w-full container mx-auto px-8 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="font-mona text-sm font-bold capitalize">
          {isHome ? (
            <Image
              src="/images/lera.svg"
              alt="LERA Communications Logo"
              width={120}
              height={40}
            />
          ) : (
            <Image
              src="/images/coloredLogo.svg"
              alt="LERA Communications Logo"
              width={120}
              height={40}
            />
          )}
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-sm font-light">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={`/${item.path}`}
                className={`font-mona text-sm font-bold capitalize text-green-600 hover:text-green-700 ${
                  active === item.path && 'border-b-2 border-b-green-600 pb-1'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-green-600 hover:text-green-700 focus:outline-none"
            onClick={handleClick}
          >
            {!nav ? (
              <RxHamburgerMenu color="green" size={20} />
            ) : (
              <LiaTimesSolid color="green" size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`${
          !nav ? 'hidden' : 'absolute bg-white w-full px-6 py-8'
        } z-50`}
      >
        {menuItems.map((item, index) => (
          <li key={index} className="mb-4">
            <Link
              href={`/${item.path}`}
              className={`font-mona text-xs font-bold capitalize text-green-600 hover:text-green-700 ${
                active === item.path && 'border-b-2 border-b-green-600 pb-1'
              }`}
              onClick={() => setNav(false)}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;