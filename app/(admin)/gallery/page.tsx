'use client';
import { useState } from 'react';
import GalleryGrid from '@/components/GalleryGrid';
import UploadModal from '@/components/UploadModal';
import { useGallery } from '@/hooks/useGallery';

export default function Home() {
  const { items, loading, error, addItem, deleteItem } = useGallery();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md" role="alert">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Image
        </button>
      </div>

      <GalleryGrid items={items} loading={loading} onDelete={deleteItem} />

      {isUploadModalOpen && (
        <UploadModal
          onUpload={addItem}
          loading={loading}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </main>
  );
}