export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    publicId: string;
    createdAt: Date;
  }
  // types/index.ts
export interface ProjectDetail {
  id: number;
  docId: string;
  title: string;
  description: string;
  imageUrls: { url: string; publicId: string }[];
  location: string;
  category?: string;
  date?: string | number | Date;
  // ...other properties
}


export interface CarouselItem {
  docId: string;
  title: string;
  description: string;
  image: { url: string; publicId: string }[];
}

export interface ProjectFormData {
  id: number;
  title: string;
  description: string;
  imageUrls: { url: string; publicId: string }[];
  fullDescription: string;
  objectives: string[];
  outcomes: string[];
  duration: string;
  location: string;
}

export interface CarouselFormData {
  title: string;
  description: string;
  image: { url: string; publicId: string }[];
}