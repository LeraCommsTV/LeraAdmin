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
    ? `rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-800" : "bg-white"}`
    : `flex items-center p-4 rounded-xl shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`;

  return (
    <div className={cardClasses}>
      {project.imageUrls.length > 0 && (
        <div className={displayMode === 'grid' ? "h-48 overflow-hidden" : "w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg"}>
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
        <div className={`flex gap-2 ${displayMode === 'list' ? 'ml-4' : ''}`}>
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
    </div>
  );
};