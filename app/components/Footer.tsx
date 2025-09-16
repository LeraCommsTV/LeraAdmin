"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const Footer = () => {
  const menuText = 'text-xs font-light font-mona';
  const headerText = 'font-black mb-2 font-mona text-sm';
  const bottomFooter = 'font-semibold mb-2 font-mona text-xs';

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    // Enhanced email validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter an email address.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', trimmedEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This email is already subscribed to our newsletter.');
        setIsLoading(false);
        return;
      }

      // Add new subscriber
      const docRef = await addDoc(subscribersRef, {
        email: trimmedEmail.toLowerCase(),
        subscribedAt: serverTimestamp(),
        status: 'active',
        source: 'footer_subscription',
        userAgent: navigator.userAgent,
        // Additional metadata
        domain: trimmedEmail.split('@')[1],
        createdAt: new Date().toISOString(),
      });

      console.log('Subscriber added with ID:', docRef.id);
      setMessage('Thank you for subscribing! You\'ll receive our latest updates.');
      setEmail('');
    } catch (error) {
      console.error('Error adding subscriber:', error);
      
      // Handle specific Firebase errors
     
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-black text-white py-4">
      {/* Top Header */}
      <div className="py-4 md:px-12 px-8">
        <p className="text-center font-mona font-semibold text-xs">
        Suite AO1 Baraqa Mall, off 69, Gwarinpa Estate, Abuja, Nigeria. | +234 806 775 0659 |
          info@leracoms.com
        </p>

      {/* Middle Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-start border-y border-y-white">
        <div className="flex flex-row flex-wrap justify-between pl-8 md:pl-28 pr-8 md:pr-16 border-r border-r-white md:pb-12 pb-0 pt-16">
          {/* Logo Section */}
          <div>
            <Image
              src="/images/lera.svg"
              alt="LERA Communications Logo"
              width={120}
              height={40}
              className="mb-4"
            />
          </div>

          {/* Useful Links */}
          <div>
            <h4 className={headerText}>Useful Links</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/about" className={menuText}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contacts" className={menuText}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className={menuText}>
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Project */}
          <div>
            <h4 className={headerText}>Our Project</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/blogs" className={menuText}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/signin" className={menuText}>
                  Admin
                </Link>
              </li>
              <li>
                <Link href="#" className={menuText}>
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="p-6 m-4">
          <h4 className="font-mona font-bold text-sm mb-4">Stay Connected</h4>
          <p className="text-xs font-mona font-light mb-4">
            Join our community for updates
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-md bg-white text-black font-mona text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
                aria-label="Email for newsletter subscription"
                maxLength={254}
              />
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-mona text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe to newsletter"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            
            {/* Error/Success Messages */}
            {error && (
              <div className="p-2 bg-red-900/50 border border-red-500 rounded text-xs text-red-300">
                {error}
              </div>
            )}
            {message && (
              <div className="p-2 bg-green-900/50 border border-green-500 rounded text-xs text-green-300">
                {message}
              </div>
            )}
            
            <p className="text-xs font-mona font-light">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="hover:text-green-400 underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mt-6 pr-8 md:pl-28 pl-8 md:pr-16 pb-8 pt-3 md:space-y-2 space-y-0 gap-4">
        <div className="flex items-center gap-3">
          {[
            { 
              Icon: FaFacebook, 
              hoverColor: 'hover:bg-blue-600',
              link: 'https://web.facebook.com/lera24.com.ng',
              label: 'Facebook'
            },
            { 
              Icon: FaLinkedin, 
              hoverColor: 'hover:bg-blue-600',
              link: 'https://www.linkedin.com/company/lera-communications/',
              label: 'LinkedIn'
            },
            { 
              Icon: FaInstagram, 
              hoverColor: 'hover:bg-pink-600',
              link: 'https://www.instagram.com/leracommunications',
              label: 'Instagram'
            },
            { 
              Icon: FaYoutube, 
              hoverColor: 'hover:bg-red-600',
              link: 'https://www.youtube.com/@leracommunications',
              label: 'YouTube'
            },
            { 
              Icon: FaTwitter, 
              hoverColor: 'hover:bg-blue-400',
              link: 'https://twitter.com/leracoms',
              label: 'Twitter'
            }
          ].map(({ Icon, hoverColor, link, label }, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${label} page`}
              className={`h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center transition-all duration-300 ${hoverColor} hover:scale-110 hover:shadow-lg active:scale-95 cursor-pointer group`}
            >
              <Icon 
                color="#1e8a46" 
                size={18} 
                className="transition-all duration-300 group-hover:text-white" 
              />
            </a>
          ))}
        </div>
        </div>
        <div className="flex space-x-4">
          <Link href="/privacy" className={`${bottomFooter} hover:text-green-400 cursor-pointer`}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={`${bottomFooter} hover:text-green-400 cursor-pointer`}>
            Terms of Service
          </Link>
          <Link href="/cookies" className={`${bottomFooter} hover:text-green-400 cursor-pointer`}>
            Cookie Policy
          </Link>
        </div>
        <p className={bottomFooter}>
          © 2025 Lera Communication Consult. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;