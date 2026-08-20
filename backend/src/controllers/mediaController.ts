import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { MediaItem } from '../models/OtherModels';
import { dbService } from '../services/dbService';

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, '../../../frontend/public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `cosmalac_${uniqueSuffix}${ext}`);
  }
});

// Strict MIME and Extension Filter (JPG/PNG only)
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG images are permitted.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB Limit
  }
});

// Media Controller
export const mediaController = {
  // List Media Items
  getMedia: async (_req: Request, res: Response) => {
    try {
      const items = await MediaItem.find().sort({ uploadedAt: -1 });
      res.json(items);
    } catch (error) {
      // Fallback from disk if DB is disconnected
      try {
        const files = fs.readdirSync(uploadsDir);
        const fallbackList = files.map((file, idx) => ({
          _id: `file_${idx}`,
          filename: file,
          originalName: file,
          url: `/uploads/${file}`,
          mimeType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
          size: 0,
          uploadedAt: new Date()
        }));
        res.json(fallbackList);
      } catch (err) {
        res.status(500).json({ message: 'Error retrieving media items' });
      }
    }
  },

  // Upload Media
  uploadImage: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const relativeUrl = `/uploads/${req.file.filename}`;
      const mediaDoc = await MediaItem.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: relativeUrl,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || req.file.originalname
      }).catch(() => null);

      res.status(201).json({
        message: 'Image uploaded successfully',
        url: relativeUrl,
        file: mediaDoc || {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: relativeUrl,
          size: req.file.size
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error processing image upload' });
    }
  },

  // Delete Media
  deleteMedia: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await MediaItem.findById(id);

      if (item) {
        const filePath = path.join(uploadsDir, item.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await MediaItem.findByIdAndDelete(id);
      } else {
        // Direct filename deletion fallback
        const filePath = path.join(uploadsDir, id);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.json({ message: 'Media asset deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting media asset' });
    }
  }
};
