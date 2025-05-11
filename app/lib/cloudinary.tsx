export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
  throw new Error('Cloudinary environment variables are not set. Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET are defined in .env.local');
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to upload image to Cloudinary: ${response.statusText}. Details: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error instanceof Error
      ? error
      : new Error('Unknown error occurred during Cloudinary upload');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to delete image from Cloudinary: ${response.statusText}. Details: ${JSON.stringify(errorData)}`
      );
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error instanceof Error
      ? error
      : new Error('Unknown error occurred during Cloudinary deletion');
  }
};