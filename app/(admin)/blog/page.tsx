"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PlusCircle, Edit2, Trash2, ChevronDown, ChevronUp, Filter, Grid, List, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Types
type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string; // Added for full post content
  status: 'published' | 'draft' | 'archived';
  date: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  featuredImage?: string; // Added for image URL or base64
  videoUrl?: string; // Added for video embed URL
};

// Mock data
const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js and TypeScript",
    excerpt: "Learn how to set up a new Next.js project with TypeScript and get started with development.",
    content: "# Getting Started with Next.js and TypeScript\n\nLearn how to set up a new Next.js project with TypeScript and get started with development.",
    status: "published",
    date: "2025-05-01",
    author: "Jane Smith",
    category: "Development",
    tags: ["Next.js", "TypeScript", "Frontend"],
    views: 1243
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS for Rapid UI Development",
    excerpt: "Discover advanced techniques for building responsive UIs with Tailwind CSS.",
    content: "# Mastering Tailwind CSS\n\nDiscover advanced techniques for building responsive UIs with Tailwind CSS.",
    status: "published",
    date: "2025-04-25",
    author: "John Doe",
    category: "Design",
    tags: ["CSS", "Tailwind", "UI"],
    views: 952
  },
  {
    id: 3,
    title: "Building a Blog Management System from Scratch",
    excerpt: "A comprehensive guide to creating your own custom blog management system.",
    content: "# Building a Blog Management System\n\nA comprehensive guide to creating your own custom blog management system.",
    status: "draft",
    date: "2025-05-05",
    author: "Jane Smith",
    category: "Development",
    tags: ["React", "CMS", "Backend"],
    views: 0
  },
  {
    id: 4,
    title: "The Future of Web Development in 2025",
    excerpt: "Exploring emerging trends and technologies that will shape web development.",
    content: "# The Future of Web Development\n\nExploring emerging trends and technologies that will shape web development.",
    status: "draft",
    date: "2025-05-03",
    author: "Alex Johnson",
    category: "Industry",
    tags: ["Trends", "Future", "WebDev"],
    views: 0
  },
  {
    id: 5,
    title: "Optimizing Performance in React Applications",
    excerpt: "Best practices for improving the performance of your React applications.",
    content: "# Optimizing Performance in React\n\nBest practices for improving the performance of your React applications.",
    status: "published",
    date: "2025-04-18",
    author: "John Doe",
    category: "Development",
    tags: ["React", "Performance", "Optimization"],
    views: 821
  },
  {
    id: 6,
    title: "Implementing Authentication in Next.js",
    excerpt: "A step-by-step guide to adding authentication to your Next.js application.",
    content: "# Implementing Authentication in Next.js\n\nA step-by-step guide to adding authentication to your Next.js application.",
    status: "archived",
    date: "2025-03-12",
    author: "Alex Johnson",
    category: "Security",
    tags: ["Authentication", "Next.js", "Security"],
    views: 743
  }
];

// Main component
export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const router = useRouter();

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => 
      (statusFilter === "all" || post.status === statusFilter) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "views") {
        return sortDirection === "asc"
          ? a.views - b.views
          : b.views - a.views;
      }
      return 0;
    });

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Delete post
  const handleDeletePost = (id: number) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete !== null) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
      if (currentPosts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Toggle sort direction
  const handleSortChange = (sortKey: string) => {
    if (sortBy === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortKey);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  // Handle navigation to EditPost page
  const handleNewPost = () => {
    router.push('/blog/editPost');
  };

  // Status badge styles
  const statusStyles = {
    published: "bg-green-700 text-green-100",
    draft: "bg-yellow-700 text-yellow-100",
    archived: "bg-gray-700 text-gray-100"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <h1 className="text-2xl font-bold text-white">Blog Management</h1>
            <button
              onClick={handleNewPost}
              aria-label="Create new post"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">New Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and controls */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-600 bg-gray-800 rounded-md w-full focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-600 bg-gray-800 rounded-md w-full appearance-none focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* View controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-700" : "bg-gray-800"}`}
                title="List view"
              >
                <List size={18} className="text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-700" : "bg-gray-800"}`}
                title="Grid view"
              >
                <Grid size={18} className="text-gray-300" />
              </button>
            </div>

            <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => handleSortChange("date")}
                className={`px-3 py-1.5 text-sm ${sortBy === "date" ? "bg-gray-700" : "bg-gray-800"} text-gray-200`}
              >
                Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSortChange("title")}
                className={`px-3 py-1.5 text-sm ${sortBy === "title" ? "bg-gray-700" : "bg-gray-800"} text-gray-200`}
              >
                Title {sortBy === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSortChange("views")}
                className={`px-3 py-1.5 text-sm ${sortBy === "views" ? "bg-gray-700" : "bg-gray-800"} text-gray-200`}
              >
                Views {sortBy === "views" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Published</div>
            <div className="text-2xl font-bold text-green-400">{posts.filter(p => p.status === "published").length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Draft</div>
            <div className="text-2xl font-bold text-green-400">{posts.filter(p => p.status === "draft").length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Views</div>
            <div className="text-2xl font-bold text-green-400">{posts.reduce((sum, post) => sum + post.views, 0)}</div>
          </div>
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && (
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No posts found</h3>
            <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}

        {/* Posts grid view */}
        {viewMode === "grid" && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPosts.map(post => (
              <div key={post.id} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[post.status]}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-green-400">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-1 text-white">{post.title}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div>{post.author}</div>
                    <div>{new Date(post.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="bg-gray-700 px-4 py-2 flex justify-between items-center border-t border-gray-600">
                  <div className="text-xs text-gray-300">{post.category}</div>
                  <div className="text-xs text-gray-300">{post.views} views</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts list view */}
        {viewMode === "list" && filteredPosts.length > 0 && (
          <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Post
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {currentPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[post.status]}`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          <span className="font-medium text-white">{post.title}</span>
                        </div>
                        <span className="text-sm text-gray-300 mt-1 line-clamp-1">{post.excerpt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">
                      {post.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button className="text-green-400 hover:text-green-300">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {filteredPosts.length > postsPerPage && (
          <div className="mt-6 flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200 hover:bg-gray-700'}`}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page ? 'bg-green-600 text-white' : 'text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200 hover:bg-gray-700'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="text-sm text-gray-300">
              Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, totalPosts)} of {totalPosts} posts
            </div>
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Delete Post</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-600"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}