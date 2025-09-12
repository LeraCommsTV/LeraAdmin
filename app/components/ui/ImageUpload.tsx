import React from 'react';
import { X } from 'lucide-react';

interface ImageUploadProps {
  files: File[];
  previews: string[];
  existingImages?: { url: string; publicId: string }[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  isDarkMode: boolean;
  maxFiles?: number;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  files,
  previews,
  existingImages = [],
  onFileChange,
  onRemoveFile,
  isDarkMode,
  maxFiles = 7,
  label = "Upload Images"
}) => {
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {label} {maxFiles > 1 && `(Max ${maxFiles})`}
      </label>
      <div className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"}`}>
        <input
          type="file"
          multiple={maxFiles > 1}
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Click to select images or drag and drop here
        </label>
      </div>
      
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {existingImages.length > 0 && (
        <div className="mt-4">
          <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Existing Images:
          </p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt={`Existing ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};