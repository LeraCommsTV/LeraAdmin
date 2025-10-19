// app/(admin)/blog/editPost/page.tsx
import { Suspense } from 'react';
import EditPostClient from './EditPostClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditPostPage({ searchParams }: PageProps) {
  // Await searchParams in Server Component
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Static header shell */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">
              {params.id ? 'Edit Blog Post' : 'Create New Post'}
            </h1>
          </div>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-300">Loading post...</p>
            </div>
          </div>
        }
      >
        <EditPostClient postId={params.id} />
      </Suspense>
    </div>
  );
}