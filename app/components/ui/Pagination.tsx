import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
  variant?: 'blue' | 'purple';
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isDark,
  variant = 'blue'
}) => {
  if (totalPages <= 1) return null;

  const colorClass = variant === 'purple' ? 'bg-purple-600' : 'bg-blue-600';

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all duration-300 ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${isDark ? 'text-white' : 'text-gray-700'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentPage === index + 1
              ? `${colorClass} text-white`
              : isDark
              ? 'text-white hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-all duration-300 ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${isDark ? 'text-white' : 'text-gray-700'}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};