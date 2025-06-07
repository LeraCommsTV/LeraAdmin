// pages/blog/editPost.tsx
"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Split from 'react-split';
import toast from 'react-hot-toast';
import { Upload, X, Save, Eye, Edit, Camera, Code, Quote, List, AlertTriangle, Info, Smile } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { db } from '@/lib/firebase';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { uploadToCloudinary, CloudinaryUploadResult } from '@/lib/cloudinary';
import htmlToMD from 'html-to-md';
import remarkGfm from 'remark-gfm';
import { remark } from 'remark';
import html from 'remark-html';
import sanitizeHtml from 'sanitize-html';
import debounce from 'lodash.debounce';
import { Editor as CKEditorType } from '@ckeditor/ckeditor5-core';
import { useCustomCKEditorConfig } from '@/lib/ckeditor-config'; // Import the new config

// Dynamic imports
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), {
  ssr: false,
  loading: () => <p className="text-gray-400">Loading editor...</p>,
});
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

// Cloudinary Upload Adapter
class CloudinaryUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }
  async upload() {
    try {
      const file = await this.loader.file;
      const result: CloudinaryUploadResult = await uploadToCloudinary(file);
      return { default: result.url };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => new CloudinaryUploadAdapter(loader);
}

// Content utilities
const contentUtils = {
  toMarkdown: (html: string) => htmlToMD(html),
  toHtml: async (markdown: string) => {
    try {
      const result = await remark().use(remarkGfm).use(html).process(markdown);
      return sanitizeHtml(String(result), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'video', 'div', 'span']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt'],
          iframe: ['src'],
          video: ['src', 'controls'],
          div: ['class'],
          span: ['class'],
        },
      });
    } catch (err) {
      console.error('Error converting Markdown to HTML:', err);
      return markdown;
    }
  },
  getWordCount: (content: string) => {
    const text = content.replace(/<[^>]+>/g, '').trim();
    return text ? text.split(/\s+/).length : 0;
  },
  getReadingTime: (wordCount: number) => Math.ceil(wordCount / 200),
  generateOutline: (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).map((el, index) => ({
      id: `heading-${index}`,
      text: el.textContent || '',
      level: parseInt(el.tagName.replace('H', '')),
    }));
    return headings;
  },
};

// Types
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  date: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  featuredImage?: string;
  videoUrl?: string;
  featuredImagePublicId?: string;
}

// Editor Toolbar Component
interface EditorToolbarProps {
  editorMode: 'visual' | 'markdown';
  toggleEditorMode: () => void;
  togglePreview: () => void;
  insertTemplate: (type: string) => void;
  isSubmitting: boolean;
  setShowEmojiPicker: (show: boolean) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editorMode,
  toggleEditorMode,
  togglePreview,
  insertTemplate,
  isSubmitting,
  setShowEmojiPicker,
}) => (
  <div className="mb-2 flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => setShowEmojiPicker(true)}
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
    <button
      type="button"
      onClick={() => insertTemplate('faq')}
      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
      disabled={isSubmitting}
    >
      <List size={16} />
      FAQ
    </button>
    <button
      type="button"
      onClick={toggleEditorMode}
      className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
      disabled={isSubmitting}
    >
      {editorMode === 'visual' ? <Code size={18} /> : <Edit size={18} />}
      {editorMode === 'visual' ? 'Markdown' : 'Visual'} Editor
    </button>
    <button
      type="button"
      onClick={togglePreview}
      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
      disabled={isSubmitting}
    >
      {togglePreview ? <Edit size={18} /> : <Eye size={18} />}
      {togglePreview ? 'Edit' : 'Preview'}
    </button>
  </div>
);

// Preview Component
interface PreviewProps {
  post: BlogPost;
  imagePreview: string | null;
  content: string;
  editorMode: 'visual' | 'markdown';
}

const Preview: React.FC<PreviewProps> = React.memo(({ post, imagePreview, content, editorMode }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    {imagePreview && (
      <img src={imagePreview} alt="Featured" className="w-full h-64 object-cover rounded-md mb-4" />
    )}
    <h2 className="text-3xl font-bold mb-4">{post.title || 'Untitled'}</h2>
    <p className="text-gray-300 mb-4">{post.excerpt || 'No excerpt'}</p>
    {post.videoUrl && ReactPlayer.canPlay(post.videoUrl) && (
      <div className="mb-4">
        <ReactPlayer url={post.videoUrl} width="100%" height="400px" controls className="rounded-md" />
      </div>
    )}
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter style={atomOneDark} language={match[1]} PreTag="div" {...props}>
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
        {editorMode === 'visual' ? contentUtils.toMarkdown(content) : content}
      </ReactMarkdown>
    </div>
    <div className="mt-4 text-sm text-gray-400">
      <p>Author: {post.author || 'Unknown'}</p>
      <p>Category: {post.category || 'Uncategorized'}</p>
      <p>Tags: {post.tags.length ? post.tags.join(', ') : 'None'}</p>
      <p>Status: {post.status}</p>
    </div>
  </div>
));

export default function EnhancedEditPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const editorRef = useRef<CKEditorType | null>(null);
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
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [outline, setOutline] = useState<{ id: string; text: string; level: number }[]>([]);

  // Use the custom CKEditor configuration
  const { BalloonEditor, editorConfig } = useCustomCKEditorConfig();

  // Merge with Cloudinary Upload Adapter
  const mergedEditorConfig = useMemo(() => {
    if (!editorConfig || !editorConfig.plugins) {
      return {};
    }
    return {
      ...editorConfig,
      extraPlugins: [...(editorConfig.extraPlugins || []), CustomUploadAdapterPlugin],
      content: {
        styles: `
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 16px; color: white; background-color: #1f2937; }
          .callout { margin: 1rem 0; padding: 1rem; border-radius: 0.5rem; display: flex; }
          .callout.info { background-color: rgba(59, 130, 246, 0.2); border-left: 4px solid #3b82f6; }
          .callout.warning { background-color: rgba(245, 158, 11, 0.2); border-left: 4px solid #f59e0b; }
          .callout-icon { font-size: 1.5rem; margin-right: 0.75rem; }
          .callout-content { flex: 1; }
          pre { background-color: #282c34; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
          blockquote { border-left: 4px solid #6b7280; padding-left: 1rem; margin-left: 0; font-style: italic; }
          blockquote footer { margin-top: 0.5rem; color: #9ca3af; }
          .ck-media__video { max-width: 100%; height: auto; }
        `,
      },
      mediaEmbed: {
        previewsInData: true,
        extraProviders: [
          {
            name: 'custom',
            url: /^.*\.(mp4|webm|ogg)$/i,
            html: (match: any) => `<video controls src="${match[0]}" class="ck-media__video"></video>`,
          },
        ],
      },
    };
  }, [editorConfig]);

  // Fetch existing post
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
            toast.error('Post not found.');
            setError('Post not found.');
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          toast.error('Failed to fetch post.');
          setError('Failed to fetch post.');
        }
      };
      fetchPost();
    }
  }, [postId]);

  // Update word count, reading time, and outline
  useEffect(() => {
    const updateStats = () => {
      const count = contentUtils.getWordCount(post.content);
      setWordCount(count);
      setReadingTime(contentUtils.getReadingTime(count));
      setOutline(contentUtils.generateOutline(post.content));
    };
    updateStats();
  }, [post.content]);

  // Autosave
  const autosave = useCallback(
    debounce(async (postData: BlogPost) => {
      if (!postId || isSubmitting) return;
      try {
        setIsAutosaving(true);
        const { id, ...dataToSave } = postData;
        await updateDoc(doc(db, 'blogPosts', postId), dataToSave);
        toast.success('Post autosaved.');
      } catch (err) {
        console.error('Autosave error:', err);
        toast.error('Autosave failed.');
      } finally {
        setIsAutosaving(false);
      }
    }, 10000),
    [postId, isSubmitting]
  );

  useEffect(() => {
    if (postId && post.content) autosave(post);
    return () => autosave.cancel();
  }, [post, autosave, postId]);

  // Handle editor content change
  const handleEditorChange = useCallback(
    async (event: any, editor: CKEditorType) => {
      const content = editor.getData();
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'video', 'div', 'span']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt'],
          iframe: ['src'],
          video: ['src', 'controls'],
          div: ['class'],
          span: ['class'],
        },
      });
      setPost((prev) => ({ ...prev, content: sanitizedContent }));
      if (editorMode === 'markdown') {
        try {
          const markdown = contentUtils.toMarkdown(sanitizedContent);
          setPost((prev) => ({ ...prev, content: markdown }));
        } catch (err) {
          console.error('Error converting HTML to Markdown:', err);
          toast.error('Failed to convert content to Markdown.');
        }
      }
    },
    [editorMode]
  );

  // Handle markdown content change
  const handleMarkdownChange = useCallback(
    debounce(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const markdown = e.target.value;
      setPost((prev) => ({ ...prev, content: markdown }));
      if (editorMode === 'visual') {
        try {
          const htmlContent = await contentUtils.toHtml(markdown);
          setPost((prev) => ({ ...prev, content: htmlContent }));
        } catch (err) {
          console.error('Error converting Markdown to HTML:', err);
          toast.error('Failed to convert Markdown to HTML.');
        }
      }
    }, 500),
    [editorMode]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setPost((prev) => ({
        ...prev,
        [name]: name === 'tags' ? value.split(',').map((tag) => tag.trim()).filter((tag) => tag) : value,
      }));
      setError(null);
    },
    []
  );

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only PNG, JPEG, or GIF images are allowed.');
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
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
  }, []);

  // Remove image
  const handleRemoveImage = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setPost((prev) => ({ ...prev, featuredImage: undefined, featuredImagePublicId: undefined }));
  }, [imagePreview]);

  // Handle emoji selection
  const onEmojiClick = useCallback(
    (emojiObject: { emoji: string }) => {
      if (editorMode === 'visual' && editorRef.current) {
        editorRef.current.model.change((writer: any) => {
          writer.insertText(emojiObject.emoji, editorRef.current!.model.document.selection.getFirstPosition());
        });
      } else {
        setPost((prev) => ({ ...prev, content: prev.content + emojiObject.emoji }));
      }
      setShowEmojiPicker(false);
    },
    [editorMode]
  );

  // Insert content template
  const insertTemplate = useCallback(
    async (type: string) => {
      let template = '';
      let markdownTemplate = '';

      switch (type) {
        case 'callout-info':
          template = `<div class="callout info"><div class="callout-icon">ℹ️</div><div class="callout-content"><p>This is an informational callout box.</p></div></div>`;
          markdownTemplate = `> **Info**\n> This is an informational callout box.\n`;
          break;
        case 'callout-warning':
          template = `<div class="callout warning"><div class="callout-icon">⚠️</div><div class="callout-content"><p>This is a warning callout box.</p></div></div>`;
          markdownTemplate = `> **Warning**\n> This is a warning callout box.\n`;
          break;
        case 'code':
          template = `<pre><code class="language-javascript">// Your code here\nconst greeting = "Hello, World!";\nconsole.log(greeting);</code></pre>`;
          markdownTemplate = `\`\`\`javascript\n// Your code here\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n\`\`\`\n`;
          break;
        case 'quote':
          template = `<blockquote><p>"The greatest glory in living lies not in never falling, but in rising every time we fall."</p><footer>— Nelson Mandela</footer></blockquote>`;
          markdownTemplate = `> "The greatest glory in living lies not in never falling, but in rising every time we fall."\n> — Nelson Mandela\n`;
          break;
        case 'faq':
          template = `<h2>FAQs</h2><h3>Question 1</h3><p>Answer to question 1.</p><h3>Question 2</h3><p>Answer to question 2.</p>`;
          markdownTemplate = `## FAQs\n### Question 1\nAnswer to question 1.\n### Question 2\nAnswer to question 2.\n`;
          break;
      }

      if (editorMode === 'visual' && editorRef.current) {
        editorRef.current.model.change((writer: any) => {
          writer.insert(writer.createElement('paragraph', null, template), editorRef.current!.model.document.selection.getFirstPosition());
        });
        const updatedHtml = editorRef.current.getData();
        const sanitizedHtml = sanitizeHtml(updatedHtml, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'video', 'div', 'span']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt'],
            iframe: ['src'],
            video: ['src', 'controls'],
            div: ['class'],
            span: ['class'],
          },
        });
        setPost((prev) => ({ ...prev, content: sanitizedHtml }));
      } else {
        setPost((prev) => ({ ...prev, content: prev.content + '\n\n' + markdownTemplate }));
        if (editorMode === 'visual') {
          const updatedMarkdown = post.content + '\n\n' + markdownTemplate;
          const updatedHtml = await contentUtils.toHtml(updatedMarkdown);
          setPost((prev) => ({ ...prev, content: updatedHtml }));
        }
      }
    },
    [editorMode, post.content]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      if (!post.title || !post.excerpt || !post.content || !post.author || !post.category) {
        toast.error('Please fill in all required fields.');
        setError('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }
      if (post.videoUrl && !ReactPlayer.canPlay(post.videoUrl)) {
        toast.error('Please enter a valid video URL (e.g., YouTube, Vimeo, MP4).');
        setError('Please enter a valid video URL.');
        setIsSubmitting(false);
        return;
      }

      try {
        let featuredImageData: CloudinaryUploadResult | undefined;
        let oldFeaturedImagePublicId = postId ? post.featuredImagePublicId : undefined;

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
          const { id, ...dataToSave } = postData;
          await addDoc(collection(db, 'blogPosts'), dataToSave);
        }

        toast.success(postId ? 'Post updated successfully!' : 'Post created successfully!');
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        router.push('/blog');
      } catch (err) {
        console.error('Error saving post:', err);
        toast.error('Failed to save post.');
        setError('Failed to save post.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [post, postId, imageFile, imagePreview, router]
  );

  // Toggle preview mode
  const togglePreview = useCallback(() => setIsPreview(!isPreview), [isPreview]);

  // Toggle editor mode
  const toggleEditorMode = useCallback(() => setEditorMode((prev) => (prev === 'visual' ? 'markdown' : 'visual')), []);

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
          <Preview post={post} imagePreview={imagePreview} content={post.content} editorMode={editorMode} />
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
              <EditorToolbar
                editorMode={editorMode}
                toggleEditorMode={toggleEditorMode}
                togglePreview={togglePreview}
                insertTemplate={insertTemplate}
                isSubmitting={isSubmitting}
                setShowEmojiPicker={setShowEmojiPicker}
              />

              {showEmojiPicker && (
                <div className="relative z-10 mb-4">
                  <div className="absolute">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                </div>
              )}

              {editorMode === 'visual' ? (
                <div className="border border-gray-600 bg-gray-800 rounded-md overflow-hidden">
                  {BalloonEditor && mergedEditorConfig ? (
                    <CKEditor
                      editor={BalloonEditor}
                      config={mergedEditorConfig}
                      data={post.content}
                      onReady={(editor: CKEditorType) => {
                        editorRef.current = editor;
                      }}
                      onChange={handleEditorChange}
                      disabled={isSubmitting}
                    />
                  ) : (
                    <p className="text-gray-400">Loading editor...</p>
                  )}
                </div>
              ) : (
                <Split className="flex flex-row gap-4" sizes={[50, 50]} minSize={300}>
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
                  <div className="bg-gray-800 p-4 rounded-md border border-gray-600 overflow-auto">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter style={atomOneDark} language={match[1]} PreTag="div" {...props}>
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
                </Split>
              )}

              <div className="mt-2 flex justify-between text-sm text-gray-400">
                <p>
                  {editorMode === 'visual'
                    ? 'Use the toolbar to format content. Add images, videos, emojis, and more.'
                    : 'Use Markdown for formatting. Preview is shown on the right.'}
                </p>
                <p>
                  Words: {wordCount} | Reading Time: {readingTime} min
                  {isAutosaving && ' | Autosaving...'}
                </p>
              </div>
            </div>

            {outline.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-2">Content Outline</h3>
                <ul className="list-disc pl-5 text-gray-300">
                  {outline.map((item) => (
                    <li
                      key={item.id}
                      className={`cursor-pointer hover:text-green-400 ${item.level === 2 ? 'ml-4' : item.level === 3 ? 'ml-8' : ''}`}
                      onClick={() => {
                        const element = document.getElementById(item.id);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
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
                Video URL (YouTube, Vimeo, or MP4/WebM/OGG)
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={post.videoUrl || ''}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                placeholder="https://www.youtube.com/watch?v=... or https://your-server.com/video.mp4"
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
                  className="mt-1 w-full p-2 border border-gray-600 bg-gray-800 rounded-md text-white focus:ring-green-500 focus:border-green-500"
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