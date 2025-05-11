import { useState } from 'react';
import Image from 'next/image';

interface UploadFormProps {
  onUpload: (title: string, description: string, file: File) => Promise<void>;
  loading: boolean;
  onClose: () => void; // Added to close the modal
}

export default function UploadForm({ onUpload, loading, onClose }: UploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 100) {
      setError('Title must be 100 characters or less');
      return;
    }

    if (description.length > 500) {
      setError('Description must be 500 characters or less');
      return;
    }

    if (!file) {
      setError('Please select an image file');
      return;
    }

    try {
      await onUpload(title, description, file);
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      setError(null);
      onClose(); // Close modal on successful upload
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Image</h2>

      <form onSubmit={handleSubmit} aria-labelledby="upload-form-title">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2"
            required
            maxLength={100}
            aria-describedby={error ? 'title-error' : undefined}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2"
            aria-describedby={error ? 'description-error' : undefined}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Image *
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            required
            aria-describedby={error ? 'image-error' : undefined}
          />
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">Preview:</p>
            <div className="relative h-40 w-40 rounded-md overflow-hidden border border-gray-200">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {error && (
          <div id="form-error" className="mb-4 text-red-500 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
              loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            aria-disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Image'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}