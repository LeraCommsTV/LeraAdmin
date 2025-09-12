"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Search, Filter, Sun, Moon, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { db } from '@/lib/firebase'; // Adjust path to your Firebase config
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Blog Post Type (aligned with admin)
type BlogPost = {
  id: string; // Firestore uses string IDs
  type: string; // e.g., "featured", "event", "news"
  date: string;
  title: string;
  excerpt: string;
  content: string; // Full content for detail page
  image: string; // Maps to featuredImage
  readTime: string; // Computed or stored
  category: string;
  status: 'published' | 'draft' | 'archived'; // From admin
  author: string;
  tags: string[];
  views: number;
  videoUrl?: string;
  featuredImagePublicId?: string;
};

// Blog Card Component
interface BlogCardProps {
  post: BlogPost;
  size?: "small" | "large";
  isDark: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, size = "small", isDark }) => {
  const router = useRouter();
  const isLarge = size === "large";
  
  return (
    <article
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={() => router.push(`/blogs/${post.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/blogs/${post.id}`)}
      aria-label={`Read more about ${post.title}`}
    >
      <div 
        className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${isLarge ? 'h-96' : 'h-64'}`}
        style={{
          backgroundImage: `url(${post.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 group-hover:to-black/90 transition-all duration-300">
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide text-black rounded animate-pulse ${
              post.type === 'featured' ? 'bg-green-500' : 'bg-white'
            }`}>
              {post.type}
            </span>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4 text-gray-300 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{post.readTime}</span>
              </div>
            </div>
            <h3 className={`text-white font-bold leading-tight group-hover:text-green-400 transition-colors ${
              isLarge ? 'text-xl' : 'text-sm'
            }`}>
              {post.title}
            </h3>
            {isLarge && (
              <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// Regular Blog Card Component
const RegularBlogCard: React.FC<{ post: BlogPost; isDark: boolean }> = ({ post, isDark }) => {
  const router = useRouter();
  return (
    <article
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={() => router.push(`/blogs/${post.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/blogs/${post.id}`)}
      aria-label={`Read more about ${post.title}`}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-green-500 text-black rounded">
            {post.type}
          </span>
        </div>
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="py-4">
        <div className={`flex items-center gap-2 text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="text-green-600 font-medium">{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-green-600 font-bold text-lg mb-2 group-hover:text-green-500 transition-colors">
          {post.title}
        </h3>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center text-green-600 text-sm mt-3 group-hover:text-green-500 transition-colors">
          <span>Read more</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

// Carousel Component
const Carousel: React.FC<{ posts: BlogPost[]; isDark: boolean }> = ({ posts, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlay]);

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posts.map((post) => (
          <div key={post.id} className="w-full flex-shrink-0">
            <BlogCard post={post} size="large" isDark={isDark} />
          </div>
        ))}
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-green-500' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Main Blog Page Component
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      const fetchedPosts: BlogPost[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop', // Fallback image
          readTime: doc.data().readTime || estimateReadTime(doc.data().content || ''), // Compute if not stored
          type: doc.data().type || 'news', // Default to 'news' if not set
        })) as BlogPost[];
      const publishedPosts = fetchedPosts.filter(post => post.status === 'published'); // Only show published posts
      setPosts(publishedPosts);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Estimate read time based on content (approx. 200 words per minute)
  const estimateReadTime = (content: string) => {
    try {
      const contentState = JSON.parse(content);
      const text = contentState.blocks?.map((block: any) => block.text).join(' ') || '';
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const minutes = Math.ceil(wordCount / 200);
      return `${minutes} min read`;
    } catch {
      return '5 min read'; // Fallback
    }
  };

  // Dynamic categories from Firestore
  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category)))];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.type === "featured");
  const otherPosts = filteredPosts.filter(post => post.type !== "featured");

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
      {/* Header with Dark Mode Toggle */}
      <header className="relative">
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 left-60 md:top-4 md:right-160 md:left-auto z-50 p-3 rounded-lg bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors duration-300 hover:scale-110"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative py-16 px-8 mt-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-light mb-6 animate-fade-in ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Latest <span className="text-green-600">Insights</span>
          </h1>
          <p className={`text-xl mb-8 animate-fade-in-delay ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Stay updated with our latest news, events, and thought leadership
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search size={20} className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                aria-label="Search articles"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
                aria-label="Filter by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-2xl font-light mb-8 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Featured威力

              Featured Stories
            </h2>
            <Carousel posts={featuredPosts} isDark={isDarkMode} />
          </div>
        )}

        {otherPosts.length > 0 && (
          <>
            <div className={`border-t pt-16 mb-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-light mb-8 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                More Stories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <div key={post.id} className="animate-fade-in-up">
                  <RegularBlogCard post={post} isDark={isDarkMode} />
                </div>
              ))}
            </div>
          </>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <h3 className={`text-2xl font-light mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No articles found
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-light mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Stay In The Loop
          </h2>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Subscribe to our newsletter for the latest updates and insights
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              aria-label="Email for newsletter"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              Subscribe
            </button>
          </div>
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
}