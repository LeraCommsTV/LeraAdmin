import { useEffect } from 'react';
import Image from 'next/image';
import { GalleryItem } from '../types';

interface ModalProps {
  item: GalleryItem;
  onClose: () => void;
}

export default function Modal({ item, onClose }: ModalProps) {
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
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {item.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Close modal"
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
        <div className="p-4">
          <div className="relative w-full h-[50vh] md:h-[60vh]">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-4">
            <p className="text-gray-700">{item.description || 'No description provided'}</p>
            <p className="text-gray-500 text-sm mt-2">
              Added on {item.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}