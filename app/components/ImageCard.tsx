import { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '../types';

interface ImageCardProps {
  item: GalleryItem;
  onDelete: (item: GalleryItem) => void;
  onClick: (item: GalleryItem) => void;
}

export default function ImageCard({ item, onDelete, onClick }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item);
  };

  return (
    <div
      className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {item.description || 'No description'}
        </p>
      </div>
      {isHovered && (
        <button
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
          onClick={handleDelete}
          aria-label={`Delete ${item.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}