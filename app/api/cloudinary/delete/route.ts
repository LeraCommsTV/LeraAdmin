import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are not set');
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}