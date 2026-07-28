export interface User {
  id: string;
  email: string;
  role: 'SuperAdmin' | 'Editor' | 'Viewer';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string; // Category ID or Name
  ingredients: string[]; // Active ingredient IDs or text names
  directions: string;
  warnings?: string;
  storage?: string;
  packaging?: string;
  images: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  chemicalName?: string;
  description: string;
  benefits: string[];
  clinicalEvidence?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: 'General' | 'Distributor';
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  message: string;
  rating: number;
  avatar?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  bannerImage: string;
  tags: string[];
  publishedAt: string;
  isFeatured?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Products' | 'Shipping' | 'Distributors';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}
