// app/components/Footer.tsx
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

const Footer = () => {
  const menuText = 'text-xs font-light font-mona';
  const headerText = 'font-black mb-2 font-mona text-sm';
  const bottomFooter = 'font-semibold mb-2 font-mona text-xs';

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Simulate successful subscription
    setMessage('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <div className="w-full bg-[#545454] text-white py-4">
      {/* Top Header */}
      <div className="py-4 md:px-12 px-8">
        <p className="text-center font-mona font-semibold text-xs">
          16B, House 2, Ademola Adetokunbo, Wuse II, Abuja. | +234-9-2918264 |
          info@lera.org
        </p>
      </div>

      {/* Middle Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-start border-y border-y-white">
        <div className="flex flex-row flex-wrap justify-between pl-8 md:pl-28 pr-8 md:pr-16 border-r border-r-white md:pb-12 pb-0 pt-16">
          {/* Logo Section */}
          <div>
            <Image
              src="/images/lera1.svg"
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
                <Link href="/contact" className={menuText}>
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
        <div className="p-6 m-4 ">
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
                className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white font-mona text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Email for newsletter subscription"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md font-mona text-xs font-medium hover:bg-green-600 transition-colors"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {message && <p className="text-xs text-green-400">{message}</p>}
            <p className="text-xs font-mona font-light">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="hover:text-green-400">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mt-6 pr-8 md:pl-28 pl-8 md:pr-16 pb-8 pt-3 md:space-y-2 space-y-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaFacebook color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaLinkedin color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaInstagram color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaYoutube color="#545454" size={18} />
          </div>
          <div className="h-[30px] w-[30px] bg-white rounded-full flex justify-center items-center">
            <FaTwitter color="#545454" size={18} />
          </div>
        </div>
        <div className="flex space-x-4">
          <p className={bottomFooter}>Privacy Policy</p>
          <p className={bottomFooter}>Terms of Service</p>
          <p className={bottomFooter}>Cookie Policy</p>
        </div>
        <p className={bottomFooter}>
          © 2024 Gender Dynamix Consult. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;

