import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  ingredients: string[]; // List of active ingredients
  directions: string;
  warnings?: string;
  storage?: string;
  packaging?: string;
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: [{ type: String }],
  directions: { type: String, required: true },
  warnings: { type: String },
  storage: { type: String },
  packaging: { type: String },
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
