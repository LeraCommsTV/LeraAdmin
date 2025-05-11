import { GalleryItem } from '../types';

export const saveGalleryItems = (items: GalleryItem[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('galleryItems', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save gallery items to localStorage:', err);
    }
  }
};

export const loadGalleryItems = (): GalleryItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const items = localStorage.getItem('galleryItems');
      if (items) {
        const parsedItems = JSON.parse(items);
        return parsedItems
          .filter((item: any): item is GalleryItem => 
            item.id && item.title && item.imageUrl && item.publicId && item.createdAt
          )
          .map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
          }));
      }
    } catch (err) {
      console.error('Failed to load gallery items from localStorage:', err);
    }
  }
  return [];
};