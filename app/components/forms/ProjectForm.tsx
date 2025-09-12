// ProjectForm.tsx
import React from 'react';
import { X, Plus } from 'lucide-react';
import { ProjectFormData } from '../../types';
import { ImageUpload } from '../ui/ImageUpload';

interface ProjectFormProps {
  formData: ProjectFormData;
  files: File[];
  previews: string[];
  isUploading: boolean;
  isDarkMode: boolean;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  formData,
  files,
  previews,
  isUploading,
  isDarkMode,
  isEditing,
  onInputChange,
  onFileChange,
  onRemoveFile,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {isEditing ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <ImageUpload
            files={files}
            previews={previews}
            existingImages={isEditing ? formData.imageUrls : []}
            onFileChange={onFileChange}
            onRemoveFile={onRemoveFile}
            isDarkMode={isDarkMode}
            maxFiles={5}
          />

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={3}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isUploading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};