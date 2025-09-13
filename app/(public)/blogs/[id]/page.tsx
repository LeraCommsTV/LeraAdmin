// app/blogs/[id]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Sun, Moon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';

// Blog Post Type (aligned with the blog page)
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
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();
  
  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Clear subscription messages after 5 seconds
  useEffect(() => {
    if (subscriptionMessage || subscriptionError) {
      const timer = setTimeout(() => {
        setSubscriptionMessage(null);
        setSubscriptionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionMessage, subscriptionError]);

  // Email validation function
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

    // Enhanced email validation
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
      // Check if email already exists
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', trimmedEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSubscriptionError('This email is already subscribed to our newsletter.');
        setIsSubscribing(false);
        return;
      }

      // Add new subscriber
      const docRef = await addDoc(subscribersRef, {
        email: trimmedEmail.toLowerCase(),
        subscribedAt: serverTimestamp(),
        status: 'active',
        source: 'blog_detail_subscription',
        userAgent: navigator.userAgent,
        // Additional metadata
        domain: trimmedEmail.split('@')[1],
        createdAt: new Date().toISOString(),
        blogPostId: id, // Track which blog post they subscribed from
      });

      console.log('Subscriber added with ID:', docRef.id);
      setSubscriptionMessage('Thank you for subscribing! You\'ll receive our latest updates.');
      setEmail('');
    } catch (error) {
      console.error('Error adding subscriber:', error);
      setSubscriptionError('Something went wrong. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Fetch single post from Firestore
  useEffect(() => {
    if (!id) {
      setError('Post not found');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'blogPosts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const data = postSnap.data();
          const fetchedPost: BlogPost = {
            id: postSnap.id,
            type: data.type || 'news',
            date: data.date || '',
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            image: data.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
            readTime: data.readTime || estimateReadTime(data.content || ''),
            category: data.category || '',
            status: data.status || 'draft',
            author: data.author || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            views: typeof data.views === 'number' ? data.views : 0,
            videoUrl: data.videoUrl,
            featuredImagePublicId: data.featuredImagePublicId,
          };
          if (fetchedPost.status === 'published') {
            setPost(fetchedPost);
          } else {
            setError('Post is not published');
          }
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Fetch recent posts (excluding current post)
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const recentQuery = query(
          collection(db, 'blogPosts'),
          where('status', '==', 'published'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(recentQuery);
        const allRecent: BlogPost[] = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            image: doc.data().featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
            readTime: doc.data().readTime || estimateReadTime(doc.data().content || ''),
            type: doc.data().type || 'news',
          })) as BlogPost[];

        // Filter out the current post
        const filteredRecent = allRecent.filter(p => p.id !== id);
        setRecentPosts(filteredRecent.slice(0, 5)); // Limit to 5
      } catch (err) {
        console.error('Error fetching recent posts:', err);
      }
    };

    fetchRecentPosts();
  }, [id]);

  // Estimate read time (same as in blog page)
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


  // Handle navigation to another post
  const handlePostClick = (postId: string) => {
    router.push(`/blogs/${postId}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading post...</p>
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
            onClick={() => router.back()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render content (assuming content is Draft.js JSON)
  const renderContent = (content: string) => {
    try {
      const contentState = JSON.parse(content);
      // Simple rendering - in production, use a proper Draft.js renderer
      const renderedBlocks = contentState.blocks?.map((block: any, index: number) => (
        <div key={index} className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {block.type === 'header-one' && <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{block.text}</h2>}
          {block.type === 'header-two' && <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{block.text}</h3>}
          {block.type === 'unordered-list-item' && <ul className={`list-disc pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><li>{block.text}</li></ul>}
          {block.type === 'ordered-list-item' && <ol className={`list-decimal pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><li>{block.text}</li></ol>}
          {['unstyled', 'p'].includes(block.type) && <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{block.text}</p>}
          {/* Add more block types as needed */}
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

      {/* Hero Image Section */}
      <div className="relative pt-24 ">
        <div className=' '>
          <img
          src={post.image}
          alt={post.title}
          className="w-full h-96 object-cover "
        />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide bg-green-500 text-black rounded mb-4">
            {post.type}
          </span>
          <h1 className="text-4xl md:text-5xl font-light mb-4">
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
            <span>{post.views} views</span>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-start gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="flex items-center mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-green-600 hover:text-green-500 font-medium mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Blog
              </button>
            </div>

            <article className="prose prose-lg max-w-none">
              {/* Render tags */}
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

              {/* Render content */}
              <div className="mb-8">
                {renderContent(post.content)}
              </div>

              {/* Video if available */}
              {post.videoUrl && (
                <div className="my-8">
                  <iframe
                    src={post.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-64 rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}
            </article>

            {/* Author Info (simple) */}
            <div className={`mt-16 p-6 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                By {post.author}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Published on {post.date} • {post.readTime} • {post.views} views
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-80 lg:w-96 flex-shrink-0 hidden md:block">
            <div className={`sticky top-8 space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {/* Recent Posts Section */}
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              } border`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Posts
                </h3>
                <ul className="space-y-3">
                  {recentPosts.map((recentPost) => (
                    <li 
                      key={recentPost.id} 
                      className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                      onClick={() => handlePostClick(recentPost.id)}
                    >
                      <img
                        src={recentPost.image}
                        alt={recentPost.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium group-hover:text-green-600 transition-colors ${
                          isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {recentPost.title}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {recentPost.date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter Widget (compact) */}
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              } border`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Stay Updated
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get the latest insights in your inbox
                </p>
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    className={`w-full px-3 py-2 border rounded focus:border-green-600 focus:outline-none text-sm disabled:opacity-50 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    maxLength={254}
                  />
                  <button 
                    type="submit"
                    disabled={isSubscribing || !email.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  
                  {/* Error/Success Messages */}
                  {subscriptionError && (
                    <div className="p-2 bg-red-900/50 border border-red-500 rounded text-xs text-red-300">
                      {subscriptionError}
                    </div>
                  )}
                  {subscriptionMessage && (
                    <div className="p-2 bg-green-900/50 border border-green-500 rounded text-xs text-green-300">
                      {subscriptionMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Newsletter Section (same as blog page) */}
      <div className={`py-16 px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Stay In The Loop
          </h2>
          <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Subscribe to our newsletter for the latest updates and insights
          </p>
          <form onSubmit={handleSubscribe}>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                className={`flex-1 px-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none transition-colors duration-300 disabled:opacity-50 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                aria-label="Email for newsletter"
                maxLength={254}
              />
              <button 
                type="submit"
                disabled={isSubscribing || !email.trim()}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            
            {/* Error/Success Messages for bottom newsletter */}
            {(subscriptionError || subscriptionMessage) && (
              <div className="mt-4 max-w-md mx-auto">
                {subscriptionError && (
                  <div className="p-3 bg-red-900/50 border border-red-500 rounded text-sm text-red-300">
                    {subscriptionError}
                  </div>
                )}
                {subscriptionMessage && (
                  <div className="p-3 bg-green-900/50 border border-green-500 rounded text-sm text-green-300">
                    {subscriptionMessage}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;