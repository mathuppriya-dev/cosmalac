import mongoose, { Schema, Document } from 'mongoose';

// 1. Category Schema
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
}
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String }
});
export const Category = mongoose.model<ICategory>('Category', CategorySchema);

// 2. Ingredient Schema
export interface IIngredient extends Document {
  name: string;
  chemicalName?: string;
  description: string;
  benefits: string[];
  clinicalEvidence?: string;
}
const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  chemicalName: { type: String },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  clinicalEvidence: { type: String }
});
export const Ingredient = mongoose.model<IIngredient>('Ingredient', IngredientSchema);

// 3. Inquiry Schema
export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: 'General' | 'Distributor';
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  notes?: string;
  createdAt: Date;
}
const InquirySchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  company: { type: String },
  type: { type: String, enum: ['General', 'Distributor'], default: 'General' },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});
export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);

// 4. Blog Schema
export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  bannerImage: string;
  tags: string[];
  publishedAt: Date;
  isFeatured: boolean;
}
const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true, default: 'Cosmalac Skincare' },
  bannerImage: { type: String, required: true },
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false }
});
export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

// 5. Testimonial Schema
export interface ITestimonial extends Document {
  name: string;
  designation: string;
  message: string;
  rating: number;
  avatar?: string;
}
const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  avatar: { type: String }
});
export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

// 6. FAQ Schema
export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: 'General' | 'Products' | 'Shipping' | 'Distributors';
}
const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, enum: ['General', 'Products', 'Shipping', 'Distributors'], default: 'General' }
});
export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);

// 7. SiteSettings Schema
export interface ISiteSettings extends Document {
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
const SiteSettingsSchema = new Schema({
  siteName: { type: String, required: true, default: 'Cosmalac' },
  tagline: { type: String, default: 'EST. 2016' },
  contactEmail: { type: String, required: true, default: 'info@cosmalac.com' },
  contactPhone: { type: String, required: true, default: '+94 11 234 5678' },
  address: { type: String, required: true, default: '123 Beauty Street, Colombo, Sri Lanka' },
  businessHours: { type: String, default: 'Mon - Fri: 9:00 AM - 5:00 PM' },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String }
  }
});
export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
