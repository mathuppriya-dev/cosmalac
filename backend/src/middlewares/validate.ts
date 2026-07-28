import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const loginValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const inquiryValidationSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is too short'),
  company: z.string().optional(),
  type: z.enum(['General', 'Distributor']),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const productValidationSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  shortDescription: z.string().min(5, 'Short description is too short'),
  category: z.string().min(2, 'Category name is too short'),
  ingredients: z.array(z.string()).default([]),
  directions: z.string().min(5, 'Directions are too short'),
  warnings: z.string().optional(),
  storage: z.string().optional(),
  packaging: z.string().optional(),
  images: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional()
});

export const blogValidationSchema = z.object({
  title: z.string().min(5, 'Title is too short'),
  content: z.string().min(20, 'Content must be longer'),
  excerpt: z.string().min(10, 'Excerpt must be longer'),
  bannerImage: z.string().min(1, 'Banner image URL is required'),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional()
});

export const testimonialValidationSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  designation: z.string().min(2, 'Designation is too short'),
  message: z.string().min(5, 'Message is too short'),
  rating: z.number().min(1).max(5).default(5),
  avatar: z.string().optional()
});

export const faqValidationSchema = z.object({
  question: z.string().min(5, 'Question is too short'),
  answer: z.string().min(5, 'Answer is too short'),
  category: z.enum(['General', 'Products', 'Shipping', 'Distributors'])
});
