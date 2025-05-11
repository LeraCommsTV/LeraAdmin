import { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { saveGalleryItems, loadGalleryItems } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await loadGalleryItems();
        setItems(fetchedItems);
      } catch (err) {
        setError('Failed to load gallery items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addItem = async (title: string, description: string, file: File) => {
    try {
      setLoading(true);
      setError(null);
      const { url: imageUrl, publicId } = await uploadToCloudinary(file);

      const newItem: GalleryItem = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        publicId,
        createdAt: new Date(),
      };

      await saveGalleryItems([newItem]);
      setItems((prevItems) => [newItem, ...prevItems]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add gallery item';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (item: GalleryItem) => {
    try {
      setLoading(true);
      setError(null);
      await deleteFromCloudinary(item.publicId);
      // Remove the item from the database (implement this function if needed)
      console.warn('deleteGalleryItem function is not implemented.');
      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery item';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    deleteItem,
  };
};