"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Clock, ArrowRight, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
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
};

interface BlogCardProps {
  post: BlogPost;
  size?: "small" | "large";
  isDark: boolean;
  onClick: () => void;
}

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

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

// Memoized Blog Card Component
const BlogCard = React.memo<BlogCardProps>(({ post, size = "small", isDark, onClick }) => {
  const isLarge = size === "large";
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);
  
  return (
    <article
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
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
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide text-black rounded ${
              post.type === 'featured' ? 'bg-green-500 animate-pulse' : 'bg-white'
            }`}>
              {post.type}
            </span>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4 text-gray-300 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={12} aria-hidden="true" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
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
});

BlogCard.displayName = 'BlogCard';

// Memoized Regular Blog Card
const RegularBlogCard = React.memo<{ post: BlogPost; isDark: boolean; onClick: () => void }>(({ post, isDark, onClick }) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);
  
  return (
    <article
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
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
          loading="lazy"
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="py-4">
        <div className={`flex items-center gap-2 text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="text-green-600 font-medium">{post.category}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.date}>{post.date}</time>
          <span aria-hidden="true">•</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-green-600 font-bold text-lg mb-2 group-hover:text-green-500 transition-colors">
          {post.title}
        </h3>
        <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center text-green-600 text-sm mt-3 group-hover:text-green-500 transition-colors">
          <span>Read more</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
});

RegularBlogCard.displayName = 'RegularBlogCard';

// Optimized Carousel Component
const Carousel = React.memo<{ posts: BlogPost[]; isDark: boolean }>(({ posts, isDark }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  }, [posts.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  }, [posts.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isAutoPlay || posts.length <= 1) return;
    
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide, posts.length]);

  const handleCardClick = useCallback((postId: string) => {
    router.push(`/blogs/${postId}`);
  }, [router]);

  if (posts.length === 0) return null;

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      role="region"
      aria-label="Featured posts carousel"
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posts.map((post) => (
          <div key={post.id} className="w-full flex-shrink-0">
            <BlogCard 
              post={post} 
              size="large" 
              isDark={isDark}
              onClick={() => handleCardClick(post.id)}
            />
          </div>
        ))}
      </div>
      
      {posts.length > 1 && (
        <>
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
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-green-500' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

Carousel.displayName = 'Carousel';

// Main Component
export default function BlogPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const postsPerPage = 6;

  // Fetch posts from Firestore (optimized with query)
  useEffect(() => {
    const postsQuery = query(
      collection(db, 'blogPosts'),
      where('status', '==', 'published')
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const fetchedPosts: BlogPost[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            image: data.featuredImage || FALLBACK_IMAGE,
            readTime: data.readTime || estimateReadTime(data.content || ''),
            type: data.type || 'news',
          } as BlogPost;
        });
        
        setPosts(fetchedPosts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Memoized categories
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(posts.map(post => post.category)))];
  }, [posts]);

  // Memoized filtered posts
  const { featuredPosts, otherPosts } = useMemo(() => {
    const filtered = posts.filter(post => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });

    return {
      featuredPosts: filtered.filter(post => post.type === "featured"),
      otherPosts: filtered.filter(post => post.type !== "featured")
    };
  }, [posts, selectedCategory, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(otherPosts.length / postsPerPage);
  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return otherPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [otherPosts, currentPage, postsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('more-stories')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [totalPages]);

  const handlePostClick = useCallback((postId: string) => {
    router.push(`/blogs/${postId}`);
  }, [router]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent mb-4" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
      {/* Hero Section */}
      <section className="relative py-16 px-8 mt-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-light mb-6 animate-fade-in ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Latest <span className="text-green-600">Insights</span>
          </h1>
          <p className={`text-xl mb-8 animate-fade-in-delay ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Stay updated with our latest news, events, and thought leadership
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search size={20} className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                aria-label="Search articles"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} aria-hidden="true" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all duration-300 ${
                  isDark 
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
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {featuredPosts.length > 0 && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <h2 
              id="featured-heading"
              className={`text-2xl font-light mb-8 text-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Featured Stories
            </h2>
            <Carousel posts={featuredPosts} isDark={isDark} />
          </section>
        )}

        {otherPosts.length > 0 ? (
          <>
            <section 
              id="more-stories"
              className={`border-t pt-16 mb-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              aria-labelledby="more-stories-heading"
            >
              <h2 
                id="more-stories-heading"
                className={`text-2xl font-light mb-8 text-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                More Stories
              </h2>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentPosts.map((post) => (
                <div key={post.id} className="animate-fade-in-up">
                  <RegularBlogCard 
                    post={post} 
                    isDark={isDark}
                    onClick={() => handlePostClick(post.id)}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center mt-12 gap-2" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className={`text-2xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No articles found
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section 
        className={`py-16 px-8 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}
        aria-labelledby="newsletter-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            id="newsletter-heading"
            className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Stay In The Loop
          </h2>
          <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Subscribe to our newsletter for the latest updates and insights
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 border rounded-lg focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              aria-label="Email for newsletter"
            />
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Animations */}
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