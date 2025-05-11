import { NextResponse } from 'next/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    await deleteFromCloudinary(publicId);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}