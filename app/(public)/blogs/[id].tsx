"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  image: string;
  readTime: string;
  type: string;
  status: 'published' | 'draft' | 'archived';
  videoUrl?: string;
  featuredImage?: string;
};

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const docRef = doc(db, 'blogPosts', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as BlogPost;
            setPost({
              ...data,
              id: docSnap.id,
              image: data.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
              readTime: data.readTime || estimateReadTime(data.content || ''),
            });
            // Increment views
            await updateDoc(docRef, { views: (data.views || 0) + 1 });
          } else {
            setError('Post not found');
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-300">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">{error || 'Post not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
            aria-label="Back to blog"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
            <span>{post.category}</span>
            <span>{post.author}</span>
            <span>{post.views} views</span>
          </div>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-96 object-cover rounded-lg mb-6"
            />
          )}
          <p className="text-gray-300 text-lg mb-6 italic">{post.excerpt}</p>
          <div className="prose prose-invert max-w-none">
            <RichTextEditor
              value={post.content}
              onChange={() => {}} // Read-only
              className="border-none bg-transparent pointer-events-none"
            />
          </div>
          {post.videoUrl && (
            <div className="my-6">
              <iframe
                src={post.videoUrl}
                title={post.title}
                className="w-full h-64 md:h-96 rounded-lg"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-700 text-gray-200 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}