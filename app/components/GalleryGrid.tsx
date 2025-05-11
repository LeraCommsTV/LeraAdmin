import { useState } from 'react';
import ImageCard from './ImageCard';
import Modal from './Modal';
import { GalleryItem } from '../types';

interface GalleryGridProps {
  items: GalleryItem[];
  loading: boolean;
  onDelete: (item: GalleryItem) => void;
}

export default function GalleryGrid({ items, loading, onDelete }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 w-full"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No images in the gallery</h3>
        <p className="text-gray-500 mt-2">Click &quot;Add Image&quot;to get started</p>
      </div>
    );
  }

  const sortedItems = [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        role="grid"
        aria-label="Image gallery"
      >
        {sortedItems.map((item) => (
          <ImageCard
            key={item.id}
            item={item}
            onDelete={onDelete}
            onClick={handleItemClick}
          />
        ))}
      </div>

      {selectedItem && <Modal item={selectedItem} onClose={closeModal} />}
    </>
  );
}