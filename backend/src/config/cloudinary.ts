import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('☁️  Cloudinary integration configured.');
} else {
  console.log('⚠️  Cloudinary env variables missing. Falling back to local storage uploads.');
}

export const uploadToCloudinary = async (filePath: string, folder: string = 'cosmalac'): Promise<string | null> => {
  if (!isCloudinaryConfigured) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'gif'],
      transformation: [{ width: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
    });
    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    return null;
  }
};

export default cloudinary;
