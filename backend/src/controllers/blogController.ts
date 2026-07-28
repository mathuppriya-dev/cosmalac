import { Request, Response } from 'express';
import { dbService } from '../services/dbService';
import { uploadToCloudinary } from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await dbService.getBlogs();
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving blogs', error: error.message });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;

  try {
    const blog = await dbService.getBlogByIdOrSlug(idOrSlug);
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving blog', error: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    let bannerImage = req.body.bannerImage || '/images/blog-placeholder.jpg';
    
    // Handle banner upload
    if (req.file) {
      const localPath = req.file.path;
      // Try Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(localPath, 'cosmalac/blog');
      if (cloudinaryUrl) {
        bannerImage = cloudinaryUrl;
        // Clean up local file
        try { fs.unlinkSync(localPath); } catch {}
      } else {
        bannerImage = `/uploads/${req.file.filename}`;
      }
    }

    const blogData = {
      ...req.body,
      bannerImage,
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : []),
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true
    };

    const newBlog = await dbService.createBlog(blogData);
    res.status(201).json(newBlog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let bannerImage = req.body.bannerImage;

    if (req.file) {
      const localPath = req.file.path;
      const cloudinaryUrl = await uploadToCloudinary(localPath, 'cosmalac/blog');
      if (cloudinaryUrl) {
        bannerImage = cloudinaryUrl;
        try { fs.unlinkSync(localPath); } catch {}
      } else {
        bannerImage = `/uploads/${req.file.filename}`;
      }
    }

    const blogData = {
      ...req.body,
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : undefined),
      isFeatured: req.body.isFeatured !== undefined ? (req.body.isFeatured === 'true' || req.body.isFeatured === true) : undefined
    };

    if (bannerImage) {
      blogData.bannerImage = bannerImage;
    }

    const updated = await dbService.updateBlog(id, blogData);
    if (!updated) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await dbService.deleteBlog(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
};
