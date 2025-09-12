// useImageUpload.tsx
import { useState, useCallback, useEffect } from 'react';

export const useImageUpload = (maxFiles: number = 5) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + newFiles.length;
      if (totalFiles > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images.`);
        return;
      }
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  }, [files, maxFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const url = prev[index];
      URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return {
    files,
    previews,
    handleFileChange,
    removeFile,
    resetFiles
  };
};