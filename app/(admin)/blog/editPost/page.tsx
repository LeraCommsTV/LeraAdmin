// pages/blog/editPost.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Loader, Eye } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import RichTextEditor from '@/components/RichTextEditor';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdsFromContent } from '@/lib/cloudinary';

type BlogPost = {
  id?: string;
  title: string;
  excerpt: string;
  content: string; // This will be Draft.js JSON content
  status: 'published' | 'draft' | 'archived';
  date: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  featuredImage?: string;
  videoUrl?: string;
  featuredImagePublicId?: string;
};

export default function EditPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEditing = !!postId;

  const [post, setPost] = useState<BlogPost>({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    author: '',
    category: '',
    tags: [],
    views: 0,
    featuredImage: '',
    videoUrl: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Load existing post if editing
  useEffect(() => {
    if (isEditing && postId) {
      setIsLoading(true);
      getDoc(doc(db, 'blogPosts', postId))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as BlogPost;
            setPost({ ...data, id: docSnap.id });
            setTagInput(data.tags.join(', '));
          } else {
            setError('Post not found');
          }
        })
        .catch((err) => {
          console.error('Error loading post:', err);
          setError('Failed to load post');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEditing, postId]);

  // Handle form input changes
  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  // Handle tag input
  const handleTagChange = (value: string) => {
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Delete old image if exists
      if (post.featuredImagePublicId) {
        await deleteFromCloudinary(post.featuredImagePublicId);
      }

      const result = await uploadToCloudinary(file);

      handleInputChange('featuredImage', result.url);
      handleInputChange('featuredImagePublicId', result.publicId);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove featured image
  const removeFeaturedImage = async () => {
    if (post.featuredImagePublicId) {
      try {
        await deleteFromCloudinary(post.featuredImagePublicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    handleInputChange('featuredImage', '');
    handleInputChange('featuredImagePublicId', '');
  };

  // Save post
  const handleSave = async (status: 'draft' | 'published') => {
    if (!post.title.trim() || !post.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const postData = {
        ...post,
        status,
        date: status === 'published' ? new Date().toISOString() : post.date,
      };

      if (isEditing && postId) {
        await updateDoc(doc(db, 'blogPosts', postId), postData);
      } else {
        await addDoc(collection(db, 'blogPosts'), postData);
      }

      router.push('/blog');
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  // Generate excerpt from content
  const generateExcerpt = () => {
    try {
      if (!post.content) return;
      
      const contentState = JSON.parse(post.content);
      let text = '';
      
      // Extract text from Draft.js blocks
      contentState.blocks?.forEach((block: any) => {
        if (block.type !== 'atomic' && block.text) {
          text += block.text + ' ';
        }
      });
      
      const excerpt = text.trim().substring(0, 200);
      handleInputChange('excerpt', excerpt + (text.length > 200 ? '...' : ''));
    } catch (error) {
      console.error('Error generating excerpt:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 animate-spin text-green-400" size={48} />
          <p className="text-gray-300">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/blog')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Eye size={16} />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                Save Draft
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                Publish
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-700 text-red-100 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-3">
            {!showPreview ? (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-xl font-semibold focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Excerpt
                    </label>
                    <button
                      onClick={generateExcerpt}
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      Auto-generate
                    </button>
                  </div>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of the post..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={post.content}
                    onChange={(content) => handleInputChange('content', content)}
                    placeholder="Start writing your post..."
                    className="min-h-[500px]"
                  />
                </div>
              </div>
            ) : (
              /* Preview Mode */
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-4">{post.title || 'Untitled Post'}</h1>
                  
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full max-h-96 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <p className="text-gray-400 text-lg mb-6 italic">
                    {post.excerpt || 'No excerpt provided'}
                  </p>
                  
                  {/* Render Draft.js content as preview */}
                  <div className="draft-preview">
                    {post.content ? (
                      <RichTextEditor
                        value={post.content}
                        onChange={() => {}} // Read-only in preview
                        className="pointer-events-none border-none bg-transparent"
                      />
                    ) : (
                      <p className="text-gray-500">No content yet...</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Post Settings */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Post Settings</h3>
                
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={post.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={post.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Author name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={post.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Post category"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => handleTagChange(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={post.date.split('T')[0]}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Featured Image</h3>
                
                {post.featuredImage ? (
                  <div className="space-y-3">
                    <img
                      src={post.featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={removeFeaturedImage}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-sm text-gray-400 mb-3">Upload featured image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFeaturedImageUpload(file);
                      }}
                      className="hidden"
                      id="featured-image"
                    />
                    <label
                      htmlFor="featured-image"
                      className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer inline-flex items-center gap-2 ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {isUploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Video URL</h3>
                <input
                  type="url"
                  value={post.videoUrl || ''}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <p className="text-xs text-gray-400 mt-1">YouTube, Vimeo, or direct video URL</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}