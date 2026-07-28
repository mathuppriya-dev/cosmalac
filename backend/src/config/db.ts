import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export let isMockDB = false;
const MOCK_FILE_PATH = path.join(__dirname, '../../mock_db.json');

// Initialize local JSON DB if MongoDB is not used
export const initMockDB = () => {
  isMockDB = true;
  console.log('⚠️  MongoDB connection failed or MONGO_URI not provided. Falling back to Local JSON Database.');
  
  if (!fs.existsSync(MOCK_FILE_PATH)) {
    const defaultData = {
      users: [],
      products: [],
      categories: [],
      ingredients: [],
      inquiries: [],
      blogs: [],
      testimonials: [],
      faqs: [],
      settings: {
        siteName: 'Cosmalac',
        tagline: 'EST. 2016',
        contactEmail: 'info@cosmalac.com',
        contactPhone: '+94 11 234 5678',
        address: '123 Beauty Street, Colombo, Sri Lanka',
        businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
        socialLinks: {
          facebook: 'https://facebook.com/cosmalac',
          instagram: 'https://instagram.com/cosmalac',
          linkedin: 'https://linkedin.com/company/cosmalac'
        }
      }
    };
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log('✅ Created fresh local JSON database: mock_db.json');
  }
};

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri || mongoUri === 'mock') {
    initMockDB();
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Timeout quickly if MongoDB isn't running
    });
    console.log('🍀 MongoDB Connected Successfully.');
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    initMockDB();
  }
};

// Helper for Mock DB CRUD operations
export const readMockData = (): any => {
  try {
    const data = fs.readFileSync(MOCK_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

export const writeMockData = (data: any) => {
  fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};
