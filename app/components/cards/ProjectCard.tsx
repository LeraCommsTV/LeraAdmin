// ProjectCard.tsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { ProjectDetail } from '../../types';

interface ProjectCardProps {
  project: ProjectDetail;
  isDarkMode: boolean;
  onEdit: (project: ProjectDetail) => void;
  onDelete: (docId: string) => void;
  displayMode: 'grid' | 'list';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isDarkMode,
  onEdit,
  onDelete,
  displayMode
}) => {
  const cardClasses = displayMode === 'grid'
    ? `rounded-lg sm:rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-800" : "bg-white"}`
    : `flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`;

  if (displayMode === 'grid') {
    return (
      <div className={cardClasses}>
        {project.imageUrls.length > 0 && (
          <div className="h-40 sm:h-48 overflow-hidden">
            <img 
              src={project.imageUrls[0].url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        )}
        <div className="p-4 sm:p-6">
          <h3 className={`font-bold text-lg sm:text-xl mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-3 line-clamp-2 sm:line-clamp-none ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p><strong>Location:</strong> {project.location}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-all duration-300 hover:scale-105"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(project.docId)}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-all duration-300 hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className={cardClasses}>
      {/* Mobile: Image and content stacked */}
      <div className="flex w-full sm:hidden">
        {project.imageUrls.length > 0 && (
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg mr-3">
            <img 
              src={project.imageUrls[0].url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h3 className={`font-bold text-base mb-1 truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-1 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p className="truncate"><strong>Location:</strong> {project.location}</p>
          </div>
        </div>
      </div>

      {/* Desktop: Image, content, and buttons in a row */}
      <div className="hidden sm:flex sm:items-center sm:w-full">
        {project.imageUrls.length > 0 && (
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg mr-4">
            <img 
              src={project.imageUrls[0].url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        )}
        <div className="flex-grow min-w-0 mr-4">
          <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {project.title}
          </h3>
          <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p><strong>Location:</strong> {project.location}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(project)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-all duration-300 hover:scale-105"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(project.docId)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-all duration-300 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Mobile: Buttons row */}
      <div className="flex gap-2 mt-3 sm:hidden w-full">
        <button
          onClick={() => onEdit(project)}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-all duration-300 hover:scale-105 flex-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(project.docId)}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-all duration-300 hover:scale-105 flex-1"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};