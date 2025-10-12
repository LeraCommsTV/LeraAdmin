import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const postRef = doc(db, 'blogPosts', params.id);
  const postSnap = await getDoc(postRef);
  
  if (!postSnap.exists()) {
    return { title: 'Post Not Found' };
  }
  
  const data = postSnap.data();
  
  return {
    title: data.title,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: [data.featuredImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt,
      images: [data.featuredImage],
    },
  };
}