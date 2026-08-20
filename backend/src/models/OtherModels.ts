import mongoose, { Schema, Document } from 'mongoose';

// 1. Inquiry Schema (Upgraded for B2B Trade Leads and Inquiries)
export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  type: 'General' | 'Distributor' | 'B2B Trade' | 'Application';
  businessType?: 'Distributor' | 'Retailer' | 'Beauty Clinic' | 'Spa' | 'E-commerce' | 'Other';
  interestedProducts?: string[];
  expectedVolume?: 'Small' | 'Medium' | 'Large' | 'Not Sure';
  message: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    country: { type: String, default: 'Sri Lanka' },
    type: {
      type: String,
      enum: ['General', 'Distributor', 'B2B Trade', 'Application'],
      default: 'General'
    },
    businessType: {
      type: String,
      enum: ['Distributor', 'Retailer', 'Beauty Clinic', 'Spa', 'E-commerce', 'Other'],
      default: 'Other'
    },
    interestedProducts: [{ type: String }],
    expectedVolume: {
      type: String,
      enum: ['Small', 'Medium', 'Large', 'Not Sure'],
      default: 'Medium'
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Rejected'],
      default: 'New'
    },
    notes: { type: String }
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);

// 2. SiteSettings Schema (Configurable WhatsApp & Brand Info)
export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsAppNumber: string;
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
  whatsAppNumber: { type: String, required: true, default: '0779178371' },
  address: { type: String, required: true, default: '123 Beauty Street, Colombo, Sri Lanka' },
  businessHours: { type: String, default: 'Mon - Fri: 9:00 AM - 5:00 PM' },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com/cosmalac' },
    instagram: { type: String, default: 'https://instagram.com/cosmalac' },
    linkedin: { type: String, default: 'https://linkedin.com/company/cosmalac' },
    twitter: { type: String }
  }
});

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

// 3. Multilingual CMS Content Schema (Vision, Mission, Core Values, Hero & Sections)
export interface ILocalizedText {
  en: string;
  si: string;
  ta: string;
}

export interface ICmsContent extends Document {
  vision: ILocalizedText;
  mission: ILocalizedText;
  values: Array<{
    id: string;
    title: ILocalizedText;
    description: ILocalizedText;
  }>;
  hero: {
    badge: ILocalizedText;
    title: ILocalizedText;
    highlight: ILocalizedText;
    description: ILocalizedText;
    ctaPrimary: ILocalizedText;
    ctaSecondary: ILocalizedText;
  };
  sections: Array<{
    id: string;
    name: string;
    visible: boolean;
    order: number;
  }>;
}

const LocalizedTextSchema = new Schema(
  {
    en: { type: String, default: '' },
    si: { type: String, default: '' },
    ta: { type: String, default: '' }
  },
  { _id: false }
);

const CmsContentSchema = new Schema({
  vision: { type: LocalizedTextSchema, required: true },
  mission: { type: LocalizedTextSchema, required: true },
  values: [
    {
      id: { type: String, required: true },
      title: { type: LocalizedTextSchema, required: true },
      description: { type: LocalizedTextSchema, required: true }
    }
  ],
  hero: {
    badge: { type: LocalizedTextSchema, default: () => ({ en: 'EST. 2016', si: 'ආරම්භය 2016', ta: 'துவக்கம் 2016' }) },
    title: { type: LocalizedTextSchema, default: () => ({ en: 'Reveal Your Natural', si: 'ඔබේ ස්වභාවික පැහැපත් බව', ta: 'உங்கள் இயற்கையான பிரகாசத்தை' }) },
    highlight: { type: LocalizedTextSchema, default: () => ({ en: 'Radiance', si: 'මතුකරගන්න', ta: 'வெளிப்படுத்துங்கள்' }) },
    description: { type: LocalizedTextSchema, default: () => ({ en: 'Formulated with luxury botanicals and proven cosmetic actives for visible clarity and effortless skin harmony.', si: 'ප්‍රමුඛ පෙළේ උද්භිද සාරය සහ සුවිශේෂී සංයෝග මඟින් ඔබේ සමට නිරෝගී පැහැපත් බවක්.', ta: 'ஆடம்பர தாவர சாறுகள் மற்றும் நிரூபிக்கப்பட்ட ஒப்பனை செயல்களுடன் வடிவமைக்கப்பட்டது.' }) },
    ctaPrimary: { type: LocalizedTextSchema, default: () => ({ en: 'Explore Formulations', si: 'නිෂ්පාදන බලන්න', ta: 'தயாரிப்புகளைப் பார்க்க' }) },
    ctaSecondary: { type: LocalizedTextSchema, default: () => ({ en: 'B2B Trade Inquiries', si: 'තොග වෙළඳ විමසීම්', ta: 'மொத்த விற்பனை விசாரணைகள்' }) }
  },
  sections: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      visible: { type: Boolean, default: true },
      order: { type: Number, default: 0 }
    }
  ]
});

export const CmsContent = mongoose.model<ICmsContent>('CmsContent', CmsContentSchema);

// 4. Media Asset Schema
export interface IMediaItem extends Document {
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  altText?: string;
  uploadedAt: Date;
}

const MediaItemSchema = new Schema({
  filename: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true, enum: ['image/jpeg', 'image/png', 'image/jpg'] },
  size: { type: Number, required: true },
  altText: { type: String, default: 'Cosmalac Skincare Asset' },
  uploadedAt: { type: Date, default: Date.now }
});

export const MediaItem = mongoose.model<IMediaItem>('MediaItem', MediaItemSchema);

// 5. FAQ Schema
export interface IFAQ extends Document {
  question: ILocalizedText;
  answer: ILocalizedText;
  category: 'General' | 'Products' | 'Shipping' | 'Distributors';
}

const FAQSchema = new Schema({
  question: { type: LocalizedTextSchema, required: true },
  answer: { type: LocalizedTextSchema, required: true },
  category: { type: String, enum: ['General', 'Products', 'Shipping', 'Distributors'], default: 'General' }
});

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);
