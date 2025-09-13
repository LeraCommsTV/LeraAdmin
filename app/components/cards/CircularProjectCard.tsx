// components/cards/CircularProjectCard.tsx
import React from 'react';
import { ProjectDetail } from '../../types';

interface CircularProjectCardProps {
  project: ProjectDetail;
  isDark: boolean;
  displayMode: 'grid' | 'list';
}

export const CircularProjectCard: React.FC<CircularProjectCardProps> = ({
  project,
  isDark,
  displayMode,
}) => {
  const cardClasses = displayMode === 'grid'
    ? `rounded-lg sm:rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDark ? "bg-gray-800" : "bg-white"}`
    : `flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 ${isDark ? "bg-gray-800" : "bg-white"}`;

  if (displayMode === 'grid') {
    return (
      <div className={cardClasses}>
        {project.imageUrls.length > 0 && (
          <div className="w-full h-40 sm:h-48 overflow-hidden rounded-t-lg sm:rounded-t-xl">
            <img 
              src={project.imageUrls[0].url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        )}
        <div className="p-4 sm:p-6">
          <h3 className={`font-bold text-lg sm:text-xl mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-3 line-clamp-2 sm:line-clamp-none ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p className="truncate sm:whitespace-normal"><strong>Location:</strong> {project.location}</p>
          </div>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className={cardClasses}>
      {/* Mobile: Circular image centered with content below */}
      <div className="flex flex-col items-center w-full sm:hidden">
        {project.imageUrls.length > 0 && (
          <div className="w-16 h-16 overflow-hidden rounded-full mb-3 flex-shrink-0">
            <img 
              src={project.imageUrls[0].url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        )}
        <div className="text-center">
          <h3 className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-2 line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p className="truncate"><strong>Location:</strong> {project.location}</p>
          </div>
        </div>
      </div>

      {/* Desktop: Traditional horizontal layout with circular image */}
      <div className="hidden sm:flex sm:items-center sm:w-full">
        {project.imageUrls.length > 0 && (
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full mr-4">
            <img 
              src={project.imageUrls[0].url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h3 className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p><strong>Location:</strong> {project.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};