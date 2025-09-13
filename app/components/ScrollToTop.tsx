// components/ui/ScrollToTop.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ScrollToTopProps {
  showAfter?: number;
  className?: string;
  duration?: number; // Custom scroll duration in milliseconds
  scrollBehavior?: 'instant' | 'smooth' | 'custom'; // Scroll behavior type
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  showAfter = 400, 
  className = '',
  duration = 200, // Much faster default (200ms instead of browser's ~500ms)
  scrollBehavior = 'custom'
}) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > showAfter) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Custom easing function for smoother animation
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Custom smooth scroll with configurable speed
  const customScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Main scroll function
  const scrollToTop = () => {
    setIsScrolling(true);
    
    switch (scrollBehavior) {
      case 'instant':
        window.scrollTo({ top: 0, behavior: 'auto' });
        setIsScrolling(false);
        break;
      case 'smooth':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setIsScrolling(false), 500);
        break;
      case 'custom':
      default:
        customScrollToTop();
        break;
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          disabled={isScrolling}
          className={`
            fixed bottom-6 right-6 z-50 
            p-3 rounded-full shadow-lg
            transition-all duration-300 ease-in-out
            transform hover:scale-110 active:scale-95
            focus:outline-none focus:ring-4 focus:ring-opacity-50
            ${isScrolling ? 'animate-pulse' : 'hover:shadow-xl'}
            ${isDark 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20 focus:ring-green-500' 
              : 'bg-white hover:bg-gray-50 text-gray-700 shadow-gray-300/50 border border-gray-200 focus:ring-green-500'
            }
            ${className}
          `}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ChevronUp 
            className={`w-6 h-6 transition-transform duration-300 ${
              isScrolling ? 'animate-bounce' : ''
            }`} 
          />
        </button>
      )}
    </>
  );
};

// Fast version of the progress indicator scroll
export const ScrollToTopWithProgress: React.FC<ScrollToTopProps> = ({ 
  showAfter = 400, 
  className = '',
  duration = 200,
  scrollBehavior = 'custom'
}) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    setScrollProgress(scrollPercent);
    setIsVisible(scrollTop > showAfter);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const customScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollToTop = () => {
    setIsScrolling(true);
    
    switch (scrollBehavior) {
      case 'instant':
        window.scrollTo({ top: 0, behavior: 'auto' });
        setIsScrolling(false);
        break;
      case 'smooth':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setIsScrolling(false), 500);
        break;
      case 'custom':
      default:
        customScrollToTop();
        break;
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          disabled={isScrolling}
          className={`
            fixed bottom-6 right-6 z-50 
            relative p-3 rounded-full shadow-lg
            transition-all duration-300 ease-in-out
            transform hover:scale-110 active:scale-95
            focus:outline-none focus:ring-4 focus:ring-opacity-50
            ${isScrolling ? 'animate-pulse' : 'hover:shadow-xl'}
            ${isDark 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20 focus:ring-green-500' 
              : 'bg-white hover:bg-gray-50 text-gray-700 shadow-gray-300/50 border border-gray-200 focus:ring-green-500'
            }
            ${className}
          `}
          aria-label="Scroll to top"
          title={`Scroll to top (${Math.round(scrollProgress)}% read)`}
        >
          {/* Progress Ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90" 
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="opacity-20"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
              className="transition-all duration-150 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Arrow Icon */}
          <ChevronUp 
            className={`relative z-10 w-6 h-6 transition-transform duration-300 ${
              isScrolling ? 'animate-bounce' : ''
            }`} 
          />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;