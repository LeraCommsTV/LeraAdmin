// app/blogs/[id]/page.tsx
// This should be a SERVER COMPONENT that wraps your client component

import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BlogDetailPage from './BlogDetailClient'; // Rename your current file to this

type Props = {
  params: Promise<{ id: string }>;
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop';

// Generate metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const postRef = doc(db, 'blogPosts', id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return {
        title: 'Post Not Found | LERA Communications',
        description: 'The requested blog post could not be found.',
      };
    }

    const post = postSnap.data();
    const image = post.featuredImage || FALLBACK_IMAGE;
    const title = `${post.title} | LERA Communications`;
    const description = post.excerpt || post.title;

    return {
      title,
      description,
      keywords: post.tags?.join(', ') || '',
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        type: 'article',
        publishedTime: new Date(post.date).toISOString(),
        authors: [post.author],
        section: post.category,
        tags: post.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [image],
        creator: '@yoursitename',
      },
      alternates: {
        canonical: `/blogs/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | LERA Communications',
      description: 'Read our latest insights and articles.',
    };
  }
}

// Server Component that renders the Client Component
export default async function BlogPostPage({ params }: Props) {
  // Await params before passing to client component
  await params;
  return <BlogDetailPage />;
}