import { useEffect } from 'react';
import UploadForm from './UploadForm';
import { GalleryItem } from '../types';

interface UploadModalProps {
  onUpload: (title: string, description: string, file: File) => Promise<void>;
  loading: boolean;
  onClose: () => void;
}

export default function UploadModal({ onUpload, loading, onClose }: UploadModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-labelledby="upload-modal-title"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="upload-modal-title" className="text-xl font-semibold text-gray-900">
            Add New Image
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close upload modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <UploadForm onUpload={onUpload} loading={loading} onClose={onClose} />
      </div>
    </div>
  );
}