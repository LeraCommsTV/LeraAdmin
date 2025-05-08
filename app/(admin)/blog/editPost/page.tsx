"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Upload, X } from 'lucide-react';

export default function EditPost() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate video URL
  const isValidVideoUrl = (url: string) => {
    return ReactPlayer.canPlay(url); // Checks if URL is playable (YouTube, Vimeo, etc.)
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!title || !excerpt || !content || !author || !category) {
      setError('Please fill in all required fields.');
      return;
    }
    if (videoUrl && !isValidVideoUrl(videoUrl)) {
      setError('Please enter a valid video URL (e.g., YouTube or Vimeo).');
      return;
    }

    const newPost = {
      id: Date.now(), // Temporary ID for mock data
      title,
      excerpt,
      content,
      status,
      date: new Date().toISOString().split('T')[0],
      author,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      views: 0,
      featuredImage: featuredImage || undefined,
      videoUrl: videoUrl || undefined,
    };

    // For mock data, we'll simulate saving by redirecting back with a success message
    // In a real app, you'd make an API call here
    try {
      // Simulate API call
      console.log('Saving post:', newPost);
      // Redirect back to BlogManagement
      router.push('/'); // Adjust to your BlogManagement route if different
    } catch (err) {
      setError('Failed to save post. Please try again.');
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Post</h1>
          <button
            onClick={togglePreview}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {error && (
          <div className="bg-red-700 text-red-100 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isPreview ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            {featuredImage && (
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-3xl font-bold mb-4">{title || 'Untitled'}</h2>
            <p className="text-gray-300 mb-4">{excerpt || 'No excerpt'}</p>
            {videoUrl && isValidVideoUrl(videoUrl) && (
              <div className="mb-4">
                <ReactPlayer
                  url={videoUrl}
                  width="100%"
                  height="400px"
                  controls
                  className="rounded-md"
                />
              </div>
            )}
            <div className="prose prose-invert">
              <ReactMarkdown>{content || 'No content'}</ReactMarkdown>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Author: {author || 'Unknown'}</p>
              <p>Category: {category || 'Uncategorized'}</p>
              <p>Tags: {tags ? tags.split(',').map(tag => tag.trim()).join(', ') : 'None'}</p>
              <p>Status: {status}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300">Excerpt</label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content (Markdown)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                rows={10}
                placeholder="Write your post content in Markdown..."
                required
              />
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300">Featured Image</label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  id="featuredImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="featuredImage"
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Upload size={18} />
                  Upload Image
                </label>
                {featuredImage && (
                  <div className="relative">
                    <img src={featuredImage} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">Video URL (YouTube, Vimeo, etc.)</label>
              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300">Author</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft' | 'archived')}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}