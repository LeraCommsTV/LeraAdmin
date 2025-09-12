// components/cards/CircularProjectCard.tsx
import React from 'react';
import { ProjectDetail } from '../../types';

interface CircularProjectCardProps {
  project: ProjectDetail;
  isDarkMode: boolean;
  displayMode: 'grid' | 'list';
}

export const CircularProjectCard: React.FC<CircularProjectCardProps> = ({
  project,
  isDarkMode,
  displayMode,
}) => {
  const cardClasses = displayMode === 'grid'
    ? `rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-800" : "bg-white"}`
    : `flex items-center p-4 rounded-xl shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`;

  const imageClasses = displayMode === 'grid' 
    ? "w-full h-48 overflow-hidden rounded-t-xl" 
    : "w-24 h-24 flex-shrink-0 overflow-hidden rounded-full";

  return (
    <div className={cardClasses}>
      {project.imageUrls.length > 0 && (
        <div className={imageClasses}>
          <img 
            src={project.imageUrls[0].url} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
          />
        </div>
      )}
      <div className={displayMode === 'grid' ? "p-6" : "p-4 flex-grow flex items-center justify-between"}>
        <div>
          <h3 className={`font-bold ${displayMode === 'grid' ? 'text-xl' : 'text-lg'} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p><strong>Location:</strong> {project.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};