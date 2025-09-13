'use client';

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Leftbar";

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Only run after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Safe localStorage access after mount
    const savedTheme = localStorage.getItem('admin-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }

    // Set initial sidebar state based on screen size
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Handle dark mode toggle
  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [darkMode, mounted]);

  // Handle click outside sidebar and resize
  useEffect(() => {
    if (!mounted) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (window.innerWidth < 768 && !target.closest('.sidebar-container') && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen, mounted]);

  // Show loading state with consistent styling
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex overflow-hidden">
      {/* Admin Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        darkMode={darkMode} 
      />

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        {/* Admin Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150 md:hidden"
                  aria-label="Toggle sidebar"
                >
                  <svg 
                    className={`h-6 w-6 transform transition-transform duration-200 ${sidebarOpen ? 'rotate-90' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <h1 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                  LERA Admin
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* Back to Website Link */}
                <a
                  href="/"
                  className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
                  title="Back to main website"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>

                {/* User Profile */}
                <button className="flex items-center p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} LERA Communications Admin Panel. All rights reserved.
          </div>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}