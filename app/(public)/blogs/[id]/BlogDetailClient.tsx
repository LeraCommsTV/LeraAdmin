// app/blogs/[id]/BlogDetailClient.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Clock, Calendar, Share2, Check, ChevronLeft, ChevronRight, Eye, Play } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, query, where, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';

// Types
type BlogPost = {
  id: string;
  type: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  tags: string[];
  views: number;
  videoUrl?: string;
  featuredImagePublicId?: string;
  featuredImage?: string;
};

// Utility Functions
const estimateReadTime = (content: string): string => {
  try {
    const contentState = JSON.parse(content);
    const text = contentState.blocks?.map((block: any) => block.text).join(' ') || '';
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  } catch {
    return '5 min read';
  }
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Newsletter Subscription Component
const NewsletterForm = React.memo<{
  postId: string;
  isDark: boolean;
  compact?: boolean;
}>(({ postId, isDark, compact = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setMessage(null);
      setIsSubscribing(true);

      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError('Please enter an email address.');
        setIsSubscribing(false);
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        setError('Please enter a valid email address.');
        setIsSubscribing(false);
        return;
      }

      try {
        const subscribersRef = collection(db, 'subscribers');
        const q = query(subscribersRef, where('email', '==', trimmedEmail.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setError('This email is already subscribed.');
          setIsSubscribing(false);
          return;
        }

        await addDoc(subscribersRef, {
          email: trimmedEmail.toLowerCase(),
          subscribedAt: serverTimestamp(),
          status: 'active',
          source: compact ? 'blog_detail_sidebar' : 'blog_detail_footer',
          userAgent: navigator.userAgent,
          domain: trimmedEmail.split('@')[1],
          createdAt: new Date().toISOString(),
          blogPostId: postId,
        });

        setMessage('Thank you for subscribing!');
        setEmail('');
      } catch (err) {
        console.error('Error adding subscriber:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setIsSubscribing(false);
      }
    },
    [email, postId, compact]
  );

  return (
    <form onSubmit={handleSubscribe}>
      <div className={compact ? 'space-y-3' : 'flex flex-col sm:flex-row gap-4 max-w-md mx-auto'}>
        <input
          type="email"
          placeholder={compact ? 'Your email address' : 'Enter your email address'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubscribing}
          className={`${compact ? 'w-full' : 'flex-1'} ${
            compact ? 'px-4 py-2 text-sm' : 'px-6 py-4'
          } border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors duration-300 disabled:opacity-50 ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          maxLength={254}
        />
        <button
          type="submit"
          disabled={isSubscribing || !email.trim()}
          className={`bg-green-600 hover:bg-green-700 text-white font-semibold ${
            compact ? 'w-full py-2.5 text-sm' : 'px-8 py-4'
          } rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap`}
        >
          {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </div>

      {(error || message) && (
        <div className={`mt-4 ${compact ? '' : 'max-w-md mx-auto'}`}>
          {error && (
            <div
              className={`p-${compact ? '2' : '3'} bg-red-900/30 border border-red-500 rounded-lg text-${
                compact ? 'xs' : 'sm'
              } text-red-300`}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              className={`p-${compact ? '2' : '3'} bg-green-900/30 border border-green-500 rounded-lg text-${
                compact ? 'xs' : 'sm'
              } text-green-300`}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </form>
  );
});

NewsletterForm.displayName = 'NewsletterForm';

// Recent Post Card Component
const RecentPostCard = React.memo<{
  post: BlogPost;
  isDark: boolean;
}>(({ post, isDark }) => (
  <Link href={`/blogs/${post.id}`}>
    <div
      className={`flex gap-3 cursor-pointer group p-2 rounded-lg transition-all ${
        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
    >
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        className="w-20 h-20 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold mb-1 line-clamp-2 group-hover:text-green-600 transition-colors ${
            isDark ? 'text-gray-200' : 'text-gray-900'
          }`}
        >
          {post.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </div>
  </Link>
));

RecentPostCard.displayName = 'RecentPostCard';

// Related Post Card Component
const RelatedPostCard = React.memo<{
  post: BlogPost;
  isDark: boolean;
}>(({ post, isDark }) => (
  <Link href={`/blogs/${post.id}`}>
    <article
      className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
        isDark ? 'bg-gray-900 hover:shadow-xl hover:shadow-green-500/10' : 'bg-white hover:shadow-xl'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase bg-green-500 text-black rounded">
          {post.type}
        </span>
      </div>
      <div className="p-6">
        <h3
          className={`text-xl font-semibold mb-2 line-clamp-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {post.title}
        </h3>
        <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  </Link>
));

RelatedPostCard.displayName = 'RelatedPostCard';

// Media Component for rendering images and videos from Draft.js
const MediaBlock = React.memo<{
  src: string;
  type: 'image' | 'video';
  caption?: string;
  isDark: boolean;
}>(({ src, type, caption, isDark }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="my-8 max-w-4xl mx-auto">
      <div className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>
        )}
        {hasError && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className={isDark ? 'text-red-400' : 'text-red-600'}>Failed to load {type}</p>
            <a href={src} target="_blank" rel="noopener noreferrer" className="text-green-500 underline mt-2">
              Open in new tab
            </a>
          </div>
        )}
        {type === 'image' ? (
          <img
            src={src}
            alt={caption || 'Content image'}
            className="w-full h-auto max-h-[600px] object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            style={{ display: hasError ? 'none' : 'block' }}
          />
        ) : (
          <video
            src={src}
            controls
            className="w-full h-auto max-h-[600px] object-contain"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            style={{ display: hasError ? 'none' : 'block' }}
          />
        )}
      </div>
      {caption && !hasError && (
        <figcaption className={`mt-3 text-sm italic text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
});

MediaBlock.displayName = 'MediaBlock';

// Main Component
const BlogDetailClient = () => {
  const params = useParams();
  const id = params.id as string;
  const { isDark } = useTheme();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Increment view count
  useEffect(() => {
    if (!post?.id) return;

    const incrementViews = async () => {
      try {
        const postRef = doc(db, 'blogPosts', post.id);
        await updateDoc(postRef, { views: increment(1) });
      } catch (err) {
        console.error('Error incrementing views:', err);
      }
    };

    incrementViews();
  }, [post?.id]);

  // Fetch data
  useEffect(() => {
    if (!id) {
      setError('Post not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setPost(null);
    setError(null);
    setCopied(false);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      try {
        const postsQuery = query(collection(db, 'blogPosts'), where('status', '==', 'published'));
        const querySnapshot = await getDocs(postsQuery);
        const posts: BlogPost[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              image: doc.data().featuredImage || FALLBACK_IMAGE,
              readTime: doc.data().readTime || estimateReadTime(doc.data().content || ''),
              type: doc.data().type || 'news',
            } as BlogPost)
        );

        const sortedPosts = posts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAllPosts(sortedPosts);

        const currentPost = sortedPosts.find((p) => p.id === id);
        if (currentPost) {
          setPost(currentPost);
          setCurrentIndex(sortedPosts.findIndex((p) => p.id === id));
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Share handlers
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  }, [post, handleCopyLink]);

  // Render content with Draft.js support
  const renderContent = useCallback(
    (content: string) => {
      const commonClass = isDark ? 'text-gray-300' : 'text-gray-700';
      try {
        const contentState = JSON.parse(content);
        if (!contentState.blocks) {
          return <p className={commonClass}>No content available</p>;
        }

        // Group consecutive list items
        const groupedBlocks: any[] = [];
        let currentList: { type: string; items: any[] } | null = null;

        contentState.blocks.forEach((block: any) => {
          if (block.type === 'unordered-list-item' || block.type === 'ordered-list-item') {
            if (!currentList || currentList.type !== block.type) {
              currentList = { type: block.type, items: [block] };
              groupedBlocks.push(currentList);
            } else {
              currentList.items.push(block);
            }
          } else {
            currentList = null;
            groupedBlocks.push(block);
          }
        });

        return groupedBlocks.map((item, index) => {
          const key = `block-${index}`;

          // Handle list groups
          if (item.items) {
            const ListTag = item.type === 'ordered-list-item' ? 'ol' : 'ul';
            const listClass = item.type === 'ordered-list-item' ? 'list-decimal' : 'list-disc';
            return (
              <ListTag key={key} className={`${listClass} pl-6 mb-4 space-y-2 ${commonClass}`}>
                {item.items.map((listItem: any, i: number) => (
                  <li key={i} className="leading-relaxed">{listItem.text}</li>
                ))}
              </ListTag>
            );
          }

          const block = item;
          if (!block.text && block.type !== 'atomic') return null;

          // Handle atomic blocks (media from Draft.js)
          if (block.type === 'atomic') {
            const entityKey = block.entityRanges?.[0]?.key;
            if (entityKey !== undefined && contentState.entityMap?.[entityKey]) {
              const entity = contentState.entityMap[entityKey];
              if (entity.type === 'MEDIA') {
                const { src, type, caption } = entity.data;
                return <MediaBlock key={key} src={src} type={type} caption={caption} isDark={isDark} />;
              }
            }
            return null;
          }

          switch (block.type) {
            case 'header-one':
              return (
                <h2
                  key={key}
                  className={`text-3xl md:text-4xl font-bold mb-6 mt-8 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {block.text}
                </h2>
              );
            case 'header-two':
              return (
                <h3
                  key={key}
                  className={`text-2xl md:text-3xl font-semibold mb-4 mt-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {block.text}
                </h3>
              );
            case 'blockquote':
              return (
                <blockquote
                  key={key}
                  className={`border-l-4 border-green-500 pl-6 py-4 my-6 italic ${
                    isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-50 text-gray-700'
                  } rounded-r-lg`}
                >
                  {block.text}
                </blockquote>
              );
            default:
              return (
                <p key={key} className={`mb-5 leading-relaxed text-lg ${commonClass}`}>
                  {block.text}
                </p>
              );
          }
        });
      } catch (err) {
        console.error('Error rendering content:', err);
        return <p className={commonClass}>Content not available</p>;
      }
    },
    [isDark]
  );

  // Memoized values
  const { prevPost, nextPost, recentPosts, youtubeVideoId } = useMemo(
    () => ({
      prevPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
      nextPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
      recentPosts: allPosts.filter((p) => p.id !== id).slice(0, 6),
      youtubeVideoId: post?.videoUrl ? extractYouTubeId(post.videoUrl) : null,
    }),
    [allPosts, currentIndex, id, post?.videoUrl]
  );

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}
      >
        <div className="text-center">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent mb-4"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}
      >
        <div className="text-center px-4">
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {error || 'Post not found'}
          </h1>
          <Link href="/blogs">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
        }`}
      >
        {/* Hero Section */}
        <header className="relative pt-16 md:pt-24">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide bg-green-500 text-black rounded mb-3 md:mb-4">
                {post.type}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
                <span className="text-green-400 font-medium">{post.category}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Article */}
            <article className="lg:col-span-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <Link href="/blogs">
                  <button className="flex items-center gap-2 text-green-600 hover:text-green-500 font-medium transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm sm:text-base">Back to Blog</span>
                  </button>
                </Link>

                <button
                  onClick={handleShare}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={18} />
                      <span className="text-sm font-medium">Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* YouTube Video - Display at the top if available */}
              {youtubeVideoId && (
                <div className="mb-8">
                  <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-black shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title="YouTube video player"
                      loading="lazy"
                    />
                  </div>
                  <div className={`mt-3 flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Play size={16} />
                    <span>Watch the video version of this article</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <div className="mb-8">{renderContent(post.content)}</div>
              </div>

              {/* Author Info */}
              <div className={`p-4 sm:p-6 rounded-lg mb-8 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Written by {post.author}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Published on {post.date} • {post.readTime}
                </p>
              </div>

              {/* Prev/Next Navigation */}
              <nav
                className={`grid grid-cols-1 ${nextPost && prevPost ? 'md:grid-cols-2' : ''} gap-4 py-8 border-t ${
                  isDark ? 'border-gray-800' : 'border-gray-200'
                }`}
                aria-label="Post navigation"
              >
                {prevPost ? (
                  <Link href={`/blogs/${prevPost.id}`} className={!nextPost ? 'md:col-span-2' : ''}>
                    <button
                      className={`w-full flex items-start gap-3 sm:gap-4 p-4 rounded-lg text-left transition-colors ${
                        isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="flex-shrink-0 mt-1" size={24} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-600 font-semibold mb-1">PREVIOUS POST</p>
                        <p
                          className={`font-semibold line-clamp-2 text-sm sm:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {prevPost.title}
                        </p>
                      </div>
                    </button>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost && (
                  <Link href={`/blogs/${nextPost.id}`} className={!prevPost ? 'md:col-span-2' : ''}>
                    <button
                      className={`w-full flex items-start gap-3 sm:gap-4 p-4 rounded-lg text-right transition-colors ${
                        isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-600 font-semibold mb-1">NEXT POST</p>
                        <p
                          className={`font-semibold line-clamp-2 text-sm sm:text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {nextPost.title}
                        </p>
                      </div>
                      <ChevronRight className="flex-shrink-0 mt-1" size={24} />
                    </button>
                  </Link>
                )}
              </nav>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Newsletter Widget */}
                <section
                  className={`p-4 sm:p-6 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}
                  aria-labelledby="sidebar-newsletter"
                >
                  <h3
                    id="sidebar-newsletter"
                    className={`text-base sm:text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    📧 Stay Updated
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get the latest insights delivered to your inbox
                  </p>
                  <NewsletterForm postId={id} isDark={isDark} compact />
                </section>

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <section
                    className={`p-4 sm:p-6 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}
                    aria-labelledby="recent-posts"
                  >
                    <h3
                      id="recent-posts"
                      className={`text-base sm:text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      📰 Recent Posts
                    </h3>
                    <div className="space-y-4">
                      {recentPosts.slice(0, 5).map((recentPost) => (
                        <RecentPostCard key={recentPost.id} post={recentPost} isDark={isDark} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Related Topics */}
                {post.tags?.length > 0 && (
                  <section
                    className={`p-4 sm:p-6 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border`}
                    aria-labelledby="related-topics"
                  >
                    <h3
                      id="related-topics"
                      className={`text-base sm:text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      🏷️ Related Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                            isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </aside>
          </div>
        </main>

        {/* Related Posts Section */}
        {recentPosts.length > 0 && (
          <section
            className={`py-12 md:py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
            aria-labelledby="related-articles"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2
                id="related-articles"
                className={`text-2xl sm:text-3xl font-bold mb-6 md:mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                More Articles You Might Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recentPosts.slice(0, 3).map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} isDark={isDark} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section
          className={`py-12 md:py-16 px-4 sm:px-8 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          aria-labelledby="footer-newsletter"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              id="footer-newsletter"
              className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Never Miss an Update
            </h2>
            <p className={`mb-6 md:mb-8 text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Subscribe to our newsletter for the latest articles, insights, and exclusive content
            </p>
            <NewsletterForm postId={id} isDark={isDark} />
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default BlogDetailClient;