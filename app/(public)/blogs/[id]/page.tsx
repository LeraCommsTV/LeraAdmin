// app/blogs/[id]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Share2, Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';

// Blog Post Type
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
};

const BlogDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();
  
  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // Share functionality states
  const [copied, setCopied] = useState(false);

  // Increment view count
  useEffect(() => {
    if (post?.id) {
      const incrementViews = async () => {
        try {
          const postRef = doc(db, 'blogPosts', post.id);
          await updateDoc(postRef, {
            views: increment(1)
          });
        } catch (err) {
          console.error('Error incrementing views:', err);
        }
      };
      incrementViews();
    }
  }, [post?.id]);

  // Update document meta tags dynamically with proper OG tags
  useEffect(() => {
    if (post) {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const siteName = 'Your Blog'; // Replace with your actual site name
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Update document title
      document.title = `${post.title} | ${siteName}`;
      
      // Function to update or create meta tag
      const updateMetaTag = (selector: string, attribute: string, content: string) => {
        let metaTag = document.querySelector(selector);
        
        if (!metaTag) {
          metaTag = document.createElement('meta');
          if (selector.includes('property')) {
            metaTag.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
          } else {
            metaTag.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
          }
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      };

      // Remove old meta tags and create fresh ones
      const removeOldMeta = (property: string) => {
        const oldTag = document.querySelector(`meta[property="${property}"]`) || 
                       document.querySelector(`meta[name="${property}"]`);
        if (oldTag) oldTag.remove();
      };

      // Clean up old tags
      ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name',
       'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
       'description', 'keywords'].forEach(removeOldMeta);

      // Open Graph tags - CRITICAL for social sharing
      const ogTags = {
        'og:title': post.title,
        'og:description': post.excerpt,
        'og:image': post.image,
        'og:image:secure_url': post.image,
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': post.title,
        'og:url': currentUrl,
        'og:type': 'article',
        'og:site_name': siteName,
        'article:published_time': new Date(post.date).toISOString(),
        'article:author': post.author,
        'article:section': post.category,
        'article:tag': post.tags.join(', ')
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });

      // Twitter Card tags
      const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:title': post.title,
        'twitter:description': post.excerpt,
        'twitter:image': post.image,
        'twitter:image:alt': post.title,
        'twitter:site': '@yoursitename', // Replace with your Twitter handle
      };

      Object.entries(twitterTags).forEach(([name, content]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });

      // Standard meta tags
      const standardTags = {
        'description': post.excerpt,
        'keywords': post.tags.join(', '),
        'author': post.author,
      };

      Object.entries(standardTags).forEach(([name, content]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = currentUrl;

      // JSON-LD structured data for better SEO
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.png` // Replace with your logo URL
          }
        },
        "datePublished": new Date(post.date).toISOString(),
        "dateModified": new Date(post.date).toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        }
      };

      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [post]);

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share via Web Share API
  const handleShare = async () => {
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
  };

  // Clear subscription messages
  useEffect(() => {
    if (subscriptionMessage || subscriptionError) {
      const timer = setTimeout(() => {
        setSubscriptionMessage(null);
        setSubscriptionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionMessage, subscriptionError]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  // Newsletter subscription handler
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscriptionError(null);
    setSubscriptionMessage(null);
    setIsSubscribing(true);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setSubscriptionError('Please enter an email address.');
      setIsSubscribing(false);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setSubscriptionError('Please enter a valid email address.');
      setIsSubscribing(false);
      return;
    }

    try {
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', trimmedEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSubscriptionError('This email is already subscribed to our newsletter.');
        setIsSubscribing(false);
        return;
      }

      await addDoc(subscribersRef, {
        email: trimmedEmail.toLowerCase(),
        subscribedAt: serverTimestamp(),
        status: 'active',
        source: 'blog_detail_subscription',
        userAgent: navigator.userAgent,
        domain: trimmedEmail.split('@')[1],
        createdAt: new Date().toISOString(),
        blogPostId: id,
      });

      setSubscriptionMessage('Thank you for subscribing! You\'ll receive our latest updates.');
      setEmail('');
    } catch (error) {
      console.error('Error adding subscriber:', error);
      setSubscriptionError('Something went wrong. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Fetch all posts and current post
  useEffect(() => {
    if (!id) {
      setError('Post not found');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all published posts
        const postsQuery = query(
          collection(db, 'blogPosts'),
          where('status', '==', 'published')
        );
        const querySnapshot = await getDocs(postsQuery);
        const posts: BlogPost[] = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            image: doc.data().featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
            readTime: doc.data().readTime || estimateReadTime(doc.data().content || ''),
            type: doc.data().type || 'news',
          })) as BlogPost[];

        // Sort by date
        const sortedPosts = posts.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAllPosts(sortedPosts);

        // Find current post
        const currentPost = sortedPosts.find(p => p.id === id);
        if (currentPost) {
          setPost(currentPost);
          setCurrentIndex(sortedPosts.findIndex(p => p.id === id));
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

  // Estimate read time
  const estimateReadTime = (content: string) => {
    try {
      const contentState = JSON.parse(content);
      const text = contentState.blocks?.map((block: any) => block.text).join(' ') || '';
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const minutes = Math.ceil(wordCount / 200);
      return `${minutes} min read`;
    } catch {
      return '5 min read';
    }
  };

  // Navigate to previous/next post
  const navigatePost = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      router.push(`/blogs/${allPosts[currentIndex - 1].id}`);
    } else if (direction === 'next' && currentIndex < allPosts.length - 1) {
      router.push(`/blogs/${allPosts[currentIndex + 1].id}`);
    }
  };

  // Handle post click
  const handlePostClick = (postId: string) => {
    router.push(`/blogs/${postId}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {error || 'Post not found'}
          </h1>
          <button
            onClick={() => router.push('/blogs')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Get prev/next posts
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Get recent posts (excluding current)
  const recentPosts = allPosts.filter(p => p.id !== id).slice(0, 6);

  // Render content
  const renderContent = (content: string) => {
    try {
      const contentState = JSON.parse(content);
      const renderedBlocks = contentState.blocks?.map((block: any, index: number) => (
        <div key={index} className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {block.type === 'header-one' && <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{block.text}</h2>}
          {block.type === 'header-two' && <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{block.text}</h3>}
          {block.type === 'unordered-list-item' && <ul className={`list-disc pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><li>{block.text}</li></ul>}
          {block.type === 'ordered-list-item' && <ol className={`list-decimal pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><li>{block.text}</li></ol>}
          {['unstyled', 'p'].includes(block.type) && <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{block.text}</p>}
        </div>
      )) || <p>No content available</p>;
      return renderedBlocks;
    } catch (err) {
      console.error('Error rendering content:', err);
      return <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Content not available</p>;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>

      {/* Hero Section */}
      <div className="relative pt-24">
        <div className="relative h-96 md:h-[500px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide bg-green-500 text-black rounded mb-4">
              {post.type}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{post.date}</span>
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => router.push('/blogs')}
                className="flex items-center gap-2 text-green-600 hover:text-green-500 font-medium transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Blog
              </button>
              
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
            {post.tags && post.tags.length > 0 && (
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

            {/* Content */}
            <article className="prose prose-lg max-w-none mb-12">
              <div className="mb-8">
                {renderContent(post.content)}
              </div>

              {post.videoUrl && (
                <div className="my-8">
                  <iframe
                    src={post.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-64 md:h-96 rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}
            </article>

            {/* Author Info */}
            <div className={`p-6 rounded-lg mb-8 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Written by {post.author}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Published on {post.date} • {post.readTime}
              </p>
            </div>

            {/* Prev/Next Navigation */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-t ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              {prevPost ? (
                <button
                  onClick={() => navigatePost('prev')}
                  className={`flex items-start gap-4 p-4 rounded-lg text-left transition-colors ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-xs text-green-600 font-semibold mb-1">PREVIOUS POST</p>
                    <p className={`font-semibold line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {prevPost.title}
                    </p>
                  </div>
                </button>
              ) : <div />}

              {nextPost && (
                <button
                  onClick={() => navigatePost('next')}
                  className={`flex items-start gap-4 p-4 rounded-lg text-right transition-colors ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-semibold mb-1">NEXT POST</p>
                    <p className={`font-semibold line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {nextPost.title}
                    </p>
                  </div>
                  <ChevronRight className="flex-shrink-0 mt-1" size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Newsletter Widget */}
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              } border`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📧 Stay Updated
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get the latest insights delivered to your inbox
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm disabled:opacity-50 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    maxLength={254}
                  />
                  <button 
                    type="submit"
                    disabled={isSubscribing || !email.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                  </button>
                  
                  {subscriptionError && (
                    <div className="p-2 bg-red-900/30 border border-red-500 rounded text-xs text-red-300">
                      {subscriptionError}
                    </div>
                  )}
                  {subscriptionMessage && (
                    <div className="p-2 bg-green-900/30 border border-green-500 rounded text-xs text-green-300">
                      {subscriptionMessage}
                    </div>
                  )}
                </form>
              </div>

              {/* Recent Posts */}
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              } border`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📰 Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map((recentPost) => (
                    <div 
                      key={recentPost.id} 
                      className={`flex gap-3 cursor-pointer group p-2 rounded-lg transition-all ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handlePostClick(recentPost.id)}
                    >
                      <img
                        src={recentPost.image}
                        alt={recentPost.title}
                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold mb-1 line-clamp-2 group-hover:text-green-600 transition-colors ${
                          isDark ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {recentPost.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{recentPost.date}</span>
                          <span>•</span>
                          <span>{recentPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories/Tags Cloud */}
              {post.tags && post.tags.length > 0 && (
                <div className={`p-6 rounded-lg ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            More Articles You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.slice(0, 3).map((relatedPost) => (
              <div
                key={relatedPost.id}
                onClick={() => handlePostClick(relatedPost.id)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isDark ? 'bg-gray-900 hover:shadow-xl hover:shadow-green-500/10' : 'bg-white hover:shadow-xl'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase bg-green-500 text-black rounded">
                    {relatedPost.type}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-2 line-clamp-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {relatedPost.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{relatedPost.date}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Never Miss an Update
          </h2>
          <p className={`mb-8 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Subscribe to our newsletter for the latest articles, insights, and exclusive content
          </p>
          <form onSubmit={handleSubscribe}>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                className={`flex-1 px-6 py-4 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors duration-300 disabled:opacity-50 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                aria-label="Email for newsletter"
                maxLength={254}
              />
              <button 
                type="submit"
                disabled={isSubscribing || !email.trim()}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </div>
            
            {(subscriptionError || subscriptionMessage) && (
              <div className="mt-4 max-w-md mx-auto">
                {subscriptionError && (
                  <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-sm text-red-300">
                    {subscriptionError}
                  </div>
                )}
                {subscriptionMessage && (
                  <div className="p-3 bg-green-900/30 border border-green-500 rounded-lg text-sm text-green-300">
                    {subscriptionMessage}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;