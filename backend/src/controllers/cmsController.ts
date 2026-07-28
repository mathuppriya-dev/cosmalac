import { Request, Response } from 'express';
import { dbService } from '../services/dbService';

// ================= TESTIMONIALS =================
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const list = await dbService.getTestimonials();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving testimonials', error: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const item = await dbService.createTestimonial(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await dbService.deleteTestimonial(id);
    if (!deleted) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};

// ================= FAQS =================
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const list = await dbService.getFAQs();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving FAQs', error: error.message });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const item = await dbService.createFAQ(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating FAQ', error: error.message });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await dbService.deleteFAQ(id);
    if (!deleted) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting FAQ', error: error.message });
  }
};

// ================= SETTINGS =================
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await dbService.getSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await dbService.updateSettings(req.body);
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

// ================= ANALYTICS DASHBOARD STATS =================
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const products = await dbService.getProducts();
    const inquiries = await dbService.getInquiries();
    const blogs = await dbService.getBlogs();
    const testimonials = await dbService.getTestimonials();

    // Group inquiries by status for mini counters
    const statusCounts = inquiries.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, { New: 0, 'In Progress': 0, Resolved: 0 });

    // Group inquiries by type
    const typeCounts = inquiries.reduce((acc: any, item: any) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, { General: 0, Distributor: 0 });

    // Generate recent activity logs for audits
    const recentActivity = [
      ...inquiries.slice(0, 5).map((inq: any) => ({
        id: inq.id || inq._id.toString(),
        type: 'inquiry',
        title: `Inquiry from ${inq.name} (${inq.type})`,
        timestamp: inq.createdAt,
        detail: inq.message.substring(0, 40) + '...'
      })),
      ...blogs.slice(0, 2).map((blog: any) => ({
        id: blog.id || blog._id.toString(),
        type: 'blog',
        title: `Blog published: "${blog.title}"`,
        timestamp: blog.publishedAt,
        detail: `Written by ${blog.author}`
      }))
    ].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      counts: {
        products: products.length,
        inquiries: inquiries.length,
        blogs: blogs.length,
        testimonials: testimonials.length,
        newInquiries: statusCounts.New,
        inProgressInquiries: statusCounts['In Progress'],
        resolvedInquiries: statusCounts.Resolved,
        b2bInquiries: typeCounts.Distributor,
        b2cInquiries: typeCounts.General
      },
      recentActivity
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving dashboard stats', error: error.message });
  }
};
