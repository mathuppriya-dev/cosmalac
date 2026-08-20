import { Request, Response } from 'express';
import { dbService } from '../services/dbService';

export const getProducts = async (req: Request, res: Response) => {
  const { category, search, isFeatured, isBestseller, status, isAdmin } = req.query;

  try {
    const filter: any = {};
    if (category) filter.category = category as string;
    if (search) filter.search = search as string;
    if (status) filter.status = status as string;
    if (isAdmin !== undefined) filter.isAdmin = isAdmin === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isBestseller !== undefined) filter.isBestseller = isBestseller === 'true';

    const products = await dbService.getProducts(filter);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;

  try {
    let product = await dbService.getProductById(idOrSlug);
    if (!product) {
      product = await dbService.getProductBySlug(idOrSlug);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    let images: string[] = req.body.images || [];
    if (typeof images === 'string') {
      images = [images];
    }

    if (files && files.length > 0) {
      const filePaths = files.map(f => `/uploads/${f.filename}`);
      images = [...images, ...filePaths];
    }

    const productData = {
      ...req.body,
      images,
      status: req.body.status || 'active',
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isBestseller: req.body.isBestseller === 'true' || req.body.isBestseller === true,
      price: req.body.price ? Number(req.body.price) : undefined,
      ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : (req.body.ingredients ? req.body.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : (req.body.benefits ? req.body.benefits.split(',').map((s: string) => s.trim()).filter(Boolean) : [])
    };

    const newProduct = await dbService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const files = req.files as Express.Multer.File[];
    let images: string[] = req.body.images;
    if (typeof images === 'string') {
      images = [images];
    }
    images = images || [];

    if (files && files.length > 0) {
      const filePaths = files.map(f => `/uploads/${f.filename}`);
      images = [...images, ...filePaths];
    }

    const productData = {
      ...req.body,
      images,
      status: req.body.status || 'active',
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isBestseller: req.body.isBestseller === 'true' || req.body.isBestseller === true,
      price: req.body.price !== undefined && req.body.price !== '' ? Number(req.body.price) : undefined,
      ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : (req.body.ingredients ? req.body.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : (req.body.benefits ? req.body.benefits.split(',').map((s: string) => s.trim()).filter(Boolean) : [])
    };

    const updated = await dbService.updateProduct(id, productData);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await dbService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await dbService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await dbService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};
