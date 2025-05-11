// pages/blog/editPost.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Upload, X, Save, Eye, Edit, Camera, Smile, Code, Quote, List, AlertTriangle, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import EmojiPicker from 'emoji-picker-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { db } from '@/lib/firebase'; // Adjust path to your Firebase config
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { uploadToCloudinary, CloudinaryUploadResult } from '@/lib/cloudinary'; // Adjust path to your Cloudinary library
import htmlToMD from 'html-to-md';
import remarkGfm from 'remark-gfm';
import { remark } from 'remark';
import html from 'remark-html';

// Dynamic import for TinyMCE editor
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p className="text-gray-400">Loading editor...</p>,
});

// Types
type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
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

export default function EnhancedEditPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const editorRef = useRef<any>(null);

  // Form state
  const [post, setPost] = useState<BlogPost>({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    author: '',
    category: '',
    tags: [],
    views: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'markdown'>('visual');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing post if editing
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const docRef = doc(db, 'blogPosts', postId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Omit<BlogPost, 'id'>;
            setPost({ id: docSnap.id, ...data });
            setImagePreview(data.featuredImage || null);
          } else {
            setError('Post not found.');
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to fetch post. Please try again.');
        }
      };
      fetchPost();
    }
  }, [postId]);

  // Handle editor content change
  const handleEditorChange = async (content: string, editor: any) => {
    setPost((prev) => ({ ...prev, content }));
    // Convert HTML to Markdown
    try {
      const markdown = htmlToMD(content);
      setPost((prev) => ({ ...prev, content: markdown }));
    } catch (err) {
      console.error('Error converting HTML to Markdown:', err);
      setError('Failed to convert content to Markdown.');
    }
  };

  // Convert HTML to Markdown
  const convertToMarkdown = (html: string) => {
    return htmlToMD(html);
  };

  // Convert Markdown to HTML
  const convertToHtml = async (markdown: string) => {
    try {
      const result = await remark().use(remarkGfm).use(html).process(markdown);
      return String(result);
    } catch (err) {
      console.error('Error converting Markdown to HTML:', err);
      return markdown;
    }
  };

  // Handle markdown content change
  const handleMarkdownChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const markdown = e.target.value;
    setPost((prev) => ({ ...prev, content: markdown }));
    // Convert Markdown to HTML for visual editor
    try {
      const htmlContent = await convertToHtml(markdown);
      setPost((prev) => ({ ...prev, content: htmlContent }));
    } catch (err) {
      console.error('Error converting Markdown to HTML:', err);
      setError('Failed to convert Markdown to HTML.');
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map((tag) => tag.trim()).filter((tag) => tag) : value,
    }));
    setError(null);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Only PNG, JPEG, or GIF images are allowed.');
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setPost((prev) => ({ ...prev, featuredImage: undefined, featuredImagePublicId: undefined }));
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject: { emoji: string }) => {
    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.execCommand('mceInsertContent', false, emojiObject.emoji);
    } else {
      setPost((prev) => ({ ...prev, content: prev.content + emojiObject.emoji }));
    }
    setShowEmojiPicker(false);
  };

  // Insert content template
  const insertTemplate = async (type: 'callout-info' | 'callout-warning' | 'code' | 'quote') => {
    let template = '';
    let markdownTemplate = '';

    switch (type) {
      case 'callout-info':
        template =
          '<div class="callout info"><div class="callout-icon">ℹ️</div><div class="callout-content"><p>This is an informational callout box. Use it for tips and helpful information.</p></div></div>';
        markdownTemplate = `
> **Info**
> This is an informational callout box. Use it for tips and helpful information.
`;
        break;
      case 'callout-warning':
        template =
          '<div class="callout warning"><div class="callout-icon">⚠️</div><div className="callout-content"><p>This is a warning callout box. Use it for important warnings or cautions.</p></div></div>';
        markdownTemplate = `
> **Warning**
> This is a warning callout box. Use it for important warnings or cautions.
`;
        break;
      case 'code':
        template =
          '<pre><code class="language-javascript">// Your code here\nconst greeting = "Hello, World!";\nconsole.log(greeting);</code></pre>';
        markdownTemplate = `markdown
\`\`\`javascript
// Your code here
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`;
        break;
      case 'quote':
        template =
          '<blockquote><p>"The greatest glory in living lies not in never falling, but in rising every time we fall."</p><footer>— Nelson Mandela</footer></blockquote>';
        markdownTemplate = `
> "The greatest glory in living lies not in never falling, but in rising every time we fall."
> — Nelson Mandela
`;
        break;
    }

    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.execCommand('mceInsertContent', false, template);
      // Update markdown content
      const updatedHtml = editorRef.current.getContent();
      const updatedMarkdown = convertToMarkdown(updatedHtml);
      setPost((prev) => ({ ...prev, content: updatedMarkdown }));
    } else {
      setPost((prev) => ({ ...prev, content: prev.content + '\n\n' + markdownTemplate }));
      // Update HTML content for visual editor
      const updatedMarkdown = post.content + '\n\n' + markdownTemplate;
      const updatedHtml = await convertToHtml(updatedMarkdown);
      setPost((prev) => ({ ...prev, content: updatedHtml }));
    }
  };

  // Validate video URL
  const isValidVideoUrl = (url: string) => {
    return ReactPlayer.canPlay(url);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!post.title || !post.excerpt || !post.content || !post.author || !post.category) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }
    if (post.videoUrl && !isValidVideoUrl(post.videoUrl)) {
      setError('Please enter a valid video URL (e.g., YouTube or Vimeo).');
      setIsSubmitting(false);
      return;
    }

    try {
      let featuredImageData: CloudinaryUploadResult | undefined;
      let oldFeaturedImagePublicId = postId ? post.featuredImagePublicId : undefined;

      // Upload new image to Cloudinary if provided
      if (imageFile) {
        featuredImageData = await uploadToCloudinary(imageFile);
      }

      const postData: BlogPost = {
        ...post,
        featuredImage: featuredImageData?.url || (imageFile ? post.featuredImage : undefined),
        featuredImagePublicId: featuredImageData?.publicId || (imageFile ? post.featuredImagePublicId : undefined),
        date: postId ? post.date : new Date().toISOString().split('T')[0],
        views: postId ? post.views : 0,
      };

      if (postId) {
        // Update existing post
        const { id, ...dataToSave } = postData;
        await updateDoc(doc(db, 'blogPosts', postId), dataToSave);
        if (featuredImageData && oldFeaturedImagePublicId) {
          await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId: oldFeaturedImagePublicId }),
          });
        }
      } else {
        // Add new post
        const { id, ...dataToSave } = postData;
        await addDoc(collection(db, 'blogPosts'), dataToSave);
      }

      // Clean up
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      router.push('/blog');
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // Toggle editor mode
  const toggleEditorMode = () => {
    setEditorMode(editorMode === 'visual' ? 'markdown' : 'visual');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{postId ? 'Edit Post' : 'Create New Post'}</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleEditorMode}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              disabled={isSubmitting}
            >
              {editorMode === 'visual' ? <Code size={18} /> : <Edit size={18} />}
              {editorMode === 'visual' ? 'Markdown' : 'Visual'} Editor
            </button>
            <button
              onClick={togglePreview}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isPreview ? <Edit size={18} /> : <Eye size={18} />}
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-700 text-red-100 p-4 rounded-md mb-6">{error}</div>}

        {isPreview ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Featured"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-3xl font-bold mb-4">{post.title || 'Untitled'}</h2>
            <p className="text-gray-300 mb-4">{post.excerpt || 'No excerpt'}</p>
            {post.videoUrl && isValidVideoUrl(post.videoUrl) && (
              <div className="mb-4">
                <ReactPlayer
                  url={post.videoUrl}
                  width="100%"
                  height="400px"
                  controls
                  className="rounded-md"
                />
              </div>
            )}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomOneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Author: {post.author || 'Unknown'}</p>
              <p>Category: {post.category || 'Uncategorized'}</p>
              <p>Tags: {post.tags.length ? post.tags.join(', ') : 'None'}</p>
              <p>Status: {post.status}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>

              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <Smile size={16} />
                  Emoji
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('callout-info')}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <Info size={16} />
                  Info Box
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('callout-warning')}
                  className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <AlertTriangle size={16} />
                  Warning Box
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('code')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <Code size={16} />
                  Code Block
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('quote')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <Quote size={16} />
                  Quote
                </button>
              </div>

              {showEmojiPicker && (
                <div className="relative z-10 mb-4">
                  <div className="absolute">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                </div>
              )}

              {editorMode === 'visual' ? (
                <div className="border border-gray-600 bg-gray-800 rounded-md overflow-hidden">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'your-tinymce-api-key'}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    value={post.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 400,
                      menubar: false,
                      skin: 'oxide-dark',
                      content_css: 'dark',
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'preview',
                        'help',
                        'wordcount',
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help',
                      content_style: `
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 16px; color: white; }
                        .callout { margin: 1rem 0; padding: 1rem; border-radius: 0.5rem; display: flex; }
                        .callout.info { background-color: rgba(59, 130, 246, 0.2); border-left: 4px solid #3b82f6; }
                        .callout.warning { background-color: rgba(245, 158, 11, 0.2); border-left: 4px solid #f59e0b; }
                        .callout-icon { font-size: 1.5rem; margin-right: 0.75rem; }
                        .callout-content { flex: 1; }
                        pre { background-color: #282c34; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
                        blockquote { border-left: 4px solid #6b7280; padding-left: 1rem; margin-left: 0; font-style: italic; }
                        blockquote footer { margin-top: 0.5rem; color: #9ca3af; }
                      `,
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <textarea
                  id="markdownContent"
                  name="content"
                  value={post.content}
                  onChange={handleMarkdownChange}
                  className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500 font-mono"
                  rows={15}
                  placeholder="Write your post content in Markdown..."
                  required
                  disabled={isSubmitting}
                />
              )}

              <p className="mt-2 text-sm text-gray-400">
                {editorMode === 'visual'
                  ? 'Use the toolbar above to format your content. You can add emojis, callout boxes, and more with the buttons above the editor.'
                  : 'You can use Markdown. Add **bold**, *italic*, # headings, [links](https://example.com), and more.'}
              </p>
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300">
                Featured Image
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  id="featuredImage"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="featuredImage"
                  className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Camera size={18} />
                  Upload Image
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                      disabled={isSubmitting}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">
                Video URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={post.videoUrl || ''}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-300">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={post.author}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={post.category}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-se600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={post.tags.join(', ')}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                placeholder="tag1, tag2, tag3"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={post.status}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                disabled={isSubmitting}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/blog')}
                className={`px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-600 flex items-center gap-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : postId ? 'Update Post' : 'Save Post'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}