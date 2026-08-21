import User, { IUser } from '../models/User';
import Product, { IProduct } from '../models/Product';
import { Category, Ingredient, Inquiry, Blog, Testimonial, FAQ, SiteSettings, CmsContent } from '../models/OtherModels';
import { isMockDB, readMockData, writeMockData } from '../config/db';

// Helper to generate IDs for local JSON database
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export const dbService = {
  // ================= USERS & AUTH =================
  async findUserByEmail(email: string): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      return data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    }
    return await User.findOne({ email }).lean();
  },

  async createUser(userData: { email: string; passwordHash: string; role: 'SuperAdmin' | 'Editor' | 'Viewer' }): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const newUser = {
        id: generateId(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      data.users.push(newUser);
      writeMockData(data);
      return newUser;
    }
    const user = new User(userData);
    await user.save();
    return user.toObject();
  },

  // ================= PRODUCTS =================
  async getProducts(filter: any = {}): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      let list = data.products || [];
      if (filter.status) {
        list = list.filter((p: any) => (p.status || 'active') === filter.status);
      } else if (!filter.isAdmin) {
        list = list.filter((p: any) => (p.status || 'active') === 'active');
      }
      if (filter.category && filter.category !== 'All') {
        list = list.filter((p: any) => p.category?.toLowerCase() === filter.category.toLowerCase());
      }
      if (filter.isFeatured !== undefined) {
        list = list.filter((p: any) => p.isFeatured === filter.isFeatured);
      }
      if (filter.isBestseller !== undefined) {
        list = list.filter((p: any) => p.isBestseller === filter.isBestseller);
      }
      if (filter.search) {
        const s = filter.search.toLowerCase();
        list = list.filter((p: any) => 
          p.title?.toLowerCase().includes(s) || 
          p.description?.toLowerCase().includes(s) ||
          (p.ingredients && Array.isArray(p.ingredients) && p.ingredients.some((ing: string) => ing.toLowerCase().includes(s)))
        );
      }
      return list;
    }
    
    const query: any = {};
    if (filter.status) {
      query.status = filter.status;
    } else if (!filter.isAdmin) {
      query.status = { $ne: 'archived' };
    }
    if (filter.category && filter.category !== 'All') {
      query.category = filter.category;
    }
    if (filter.isFeatured !== undefined) {
      query.isFeatured = filter.isFeatured;
    }
    if (filter.isBestseller !== undefined) {
      query.isBestseller = filter.isBestseller;
    }
    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { ingredients: { $in: [new RegExp(filter.search, 'i')] } }
      ];
    }
    const items = await Product.find(query).sort({ createdAt: -1 }).lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async getProductById(id: string): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const clean = id.toLowerCase().trim();
      return (data.products || []).find((p: any) => 
        (p.id && p.id.toLowerCase() === clean) || 
        (p.slug && p.slug.toLowerCase() === clean) ||
        (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === clean)
      );
    }
    try {
      const item = await Product.findById(id).lean();
      if (item) return { ...item, id: item._id.toString() };
    } catch (e) {}
    const bySlug = await Product.findOne({ $or: [{ slug: id }, { slug: id.toLowerCase() }] }).lean();
    return bySlug ? { ...bySlug, id: bySlug._id.toString() } : null;
  },

  async getProductBySlug(slug: string): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const clean = slug.toLowerCase().trim();
      return (data.products || []).find((p: any) => 
        (p.slug && p.slug.toLowerCase() === clean) || 
        (p.id && p.id.toLowerCase() === clean) ||
        (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === clean)
      );
    }
    const clean = slug.toLowerCase().trim();
    const item = await Product.findOne({ $or: [{ slug }, { slug: clean }] }).lean();
    return item ? { ...item, id: item._id.toString() } : null;
  },

  async createProduct(productData: any): Promise<any> {
    const slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();
    if (isMockDB) {
      const data = readMockData();
      const newProduct = {
        id: generateId(),
        slug,
        images: productData.images || [],
        status: productData.status || 'active',
        ...productData,
        createdAt: now,
        updatedAt: now
      };
      data.products.push(newProduct);
      writeMockData(data);
      return newProduct;
    }
    const product = new Product({ ...productData, slug, status: productData.status || 'active' });
    await product.save();
    return product.toObject();
  },

  async updateProduct(id: string, productData: any): Promise<any> {
    const now = new Date().toISOString();
    if (isMockDB) {
      const data = readMockData();
      const idx = data.products.findIndex((p: any) => p.id === id);
      if (idx === -1) return null;
      
      const slug = productData.title ? productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : data.products[idx].slug;
      
      data.products[idx] = {
        ...data.products[idx],
        ...productData,
        slug,
        updatedAt: now
      };
      writeMockData(data);
      return data.products[idx];
    }
    if (productData.title) {
      productData.slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const item = await Product.findByIdAndUpdate(id, productData, { new: true }).lean();
    return item ? { ...item, id: item._id.toString() } : null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isMockDB) {
      const data = readMockData();
      const lengthBefore = data.products.length;
      data.products = data.products.filter((p: any) => p.id !== id);
      writeMockData(data);
      return data.products.length < lengthBefore;
    }
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  },

  // ================= CATEGORIES =================
  async getCategories(): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      return data.categories || [];
    }
    const items = await Category.find().lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async createCategory(categoryData: { name: string; description?: string }): Promise<any> {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (isMockDB) {
      const data = readMockData();
      const newCat = {
        id: generateId(),
        slug,
        ...categoryData
      };
      data.categories.push(newCat);
      writeMockData(data);
      return newCat;
    }
    const cat = new Category({ ...categoryData, slug });
    await cat.save();
    return cat.toObject();
  },

  // ================= INGREDIENTS =================
  async getIngredients(): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      return data.ingredients || [];
    }
    const items = await Ingredient.find().lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async createIngredient(ingData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const newIng = {
        id: generateId(),
        ...ingData
      };
      data.ingredients.push(newIng);
      writeMockData(data);
      return newIng;
    }
    const ing = new Ingredient(ingData);
    await ing.save();
    return ing.toObject();
  },

  // ================= INQUIRIES =================
  async getInquiries(): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      return data.inquiries || [];
    }
    const items = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async createInquiry(inquiryData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const newInq = {
        id: generateId(),
        status: 'New',
        notes: '',
        ...inquiryData,
        createdAt: new Date().toISOString()
      };
      data.inquiries.push(newInq);
      writeMockData(data);
      return newInq;
    }
    const inq = new Inquiry(inquiryData);
    await inq.save();
    return inq.toObject();
  },

  async updateInquiryStatus(id: string, status: 'New' | 'In Progress' | 'Resolved', notes?: string): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const idx = data.inquiries.findIndex((i: any) => i.id === id);
      if (idx === -1) return null;
      data.inquiries[idx].status = status;
      if (notes !== undefined) {
        data.inquiries[idx].notes = notes;
      }
      writeMockData(data);
      return data.inquiries[idx];
    }
    const updates: any = { status };
    if (notes !== undefined) updates.notes = notes;
    const item = await Inquiry.findByIdAndUpdate(id, updates, { new: true }).lean();
    return item ? { ...item, id: item._id.toString() } : null;
  },

  // ================= BLOGS =================
  async getBlogs(): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      return data.blogs || [];
    }
    const items = await Blog.find().sort({ publishedAt: -1 }).lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async getBlogByIdOrSlug(idOrSlug: string): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      return data.blogs.find((b: any) => b.id === idOrSlug || b.slug === idOrSlug);
    }
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
    const item = await Blog.findOne(query).lean();
    return item ? { ...item, id: item._id.toString() } : null;
  },

  async createBlog(blogData: any): Promise<any> {
    const slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (isMockDB) {
      const data = readMockData();
      const newBlog = {
        id: generateId(),
        slug,
        ...blogData,
        publishedAt: new Date().toISOString()
      };
      data.blogs.push(newBlog);
      writeMockData(data);
      return newBlog;
    }
    const blog = new Blog({ ...blogData, slug });
    await blog.save();
    return blog.toObject();
  },

  async updateBlog(id: string, blogData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const idx = data.blogs.findIndex((b: any) => b.id === id);
      if (idx === -1) return null;
      const slug = blogData.title ? blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : data.blogs[idx].slug;
      data.blogs[idx] = {
        ...data.blogs[idx],
        ...blogData,
        slug
      };
      writeMockData(data);
      return data.blogs[idx];
    }
    if (blogData.title) {
      blogData.slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const item = await Blog.findByIdAndUpdate(id, blogData, { new: true }).lean();
    return item ? { ...item, id: item._id.toString() } : null;
  },

  async deleteBlog(id: string): Promise<boolean> {
    if (isMockDB) {
      const data = readMockData();
      const len = data.blogs.length;
      data.blogs = data.blogs.filter((b: any) => b.id !== id);
      writeMockData(data);
      return data.blogs.length < len;
    }
    const res = await Blog.findByIdAndDelete(id);
    return !!res;
  },

  // ================= TESTIMONIALS =================
  async getTestimonials(): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      return data.testimonials || [];
    }
    const items = await Testimonial.find().lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async createTestimonial(testData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const newTest = { id: generateId(), ...testData };
      data.testimonials.push(newTest);
      writeMockData(data);
      return newTest;
    }
    const test = new Testimonial(testData);
    await test.save();
    return test.toObject();
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    if (isMockDB) {
      const data = readMockData();
      const len = data.testimonials.length;
      data.testimonials = data.testimonials.filter((t: any) => t.id !== id);
      writeMockData(data);
      return data.testimonials.length < len;
    }
    const res = await Testimonial.findByIdAndDelete(id);
    return !!res;
  },

  // ================= FAQS =================
  async getFAQs(): Promise<any[]> {
    if (isMockDB) {
      const data = readMockData();
      return data.faqs || [];
    }
    const items = await FAQ.find().lean();
    return items.map((item: any) => ({ ...item, id: item._id.toString() }));
  },

  async createFAQ(faqData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      const newFAQ = { id: generateId(), ...faqData };
      data.faqs.push(newFAQ);
      writeMockData(data);
      return newFAQ;
    }
    const faq = new FAQ(faqData);
    await faq.save();
    return faq.toObject();
  },

  async deleteFAQ(id: string): Promise<boolean> {
    if (isMockDB) {
      const data = readMockData();
      const len = data.faqs.length;
      data.faqs = data.faqs.filter((f: any) => f.id !== id);
      writeMockData(data);
      return data.faqs.length < len;
    }
    const res = await FAQ.findByIdAndDelete(id);
    return !!res;
  },

  // ================= SETTINGS =================
  async getSettings(): Promise<any> {
    const defaultSettings = {
      siteName: 'Cosmalac',
      tagline: 'EST. 2016',
      contactEmail: 'info@cosmalac.com',
      contactPhone: '+94 11 234 5678',
      whatsAppNumber: '0779178371',
      address: '123 Beauty Street, Colombo, Sri Lanka',
      businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
      socialLinks: {
        facebook: 'https://facebook.com/cosmalac',
        instagram: 'https://instagram.com/cosmalac',
        linkedin: 'https://linkedin.com/company/cosmalac'
      }
    };

    if (isMockDB) {
      const data = readMockData();
      if (!data.settings) {
        data.settings = defaultSettings;
        writeMockData(data);
      }
      if (!data.settings.whatsAppNumber) {
        data.settings.whatsAppNumber = '0779178371';
        writeMockData(data);
      }
      return data.settings;
    }
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      const newSettings = new SiteSettings(defaultSettings);
      await newSettings.save();
      return newSettings.toObject();
    }
    return { ...settings, id: settings._id.toString() };
  },

  async updateSettings(settingsData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      data.settings = { ...data.settings, ...settingsData };
      writeMockData(data);
      return data.settings;
    }
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(settingsData);
    } else {
      Object.assign(settings, settingsData);
    }
    await settings.save();
    return settings.toObject();
  },

  // ================= CMS CONTENT (VISION, MISSION, VALUES, HERO, SECTIONS) =================
  async getCmsContent(): Promise<any> {
    const defaultContent = {
      vision: {
        en: 'To become a global benchmark for clean, scientific skin brightening, proving that high-end beauty and clinical safety can coexist seamlessly.'
      },
      mission: {
        en: 'To formulate luxurious, skin-friendly beauty solutions that restore natural confidence, combining enriching botanical care with targeted cosmetic performance.'
      },
      values: [
        {
          id: 'val_1',
          title: { en: 'Since 2016' },
          description: { en: 'Over 9 Years of Skincare Trust' }
        },
        {
          id: 'val_2',
          title: { en: 'Targeted Radiance' },
          description: { en: 'Visible Clarity & Tone Balance' }
        },
        {
          id: 'val_3',
          title: { en: 'Barrier Comfort' },
          description: { en: 'Rich Botanical Night Lipids' }
        },
        {
          id: 'val_4',
          title: { en: 'B2B Verified' },
          description: { en: 'Wholesale Distributor Network' }
        }
      ],
      hero: {
        badge: { en: 'EST. 2016' },
        title: { en: 'Reveal Your Natural' },
        highlight: { en: 'Radiance' },
        description: {
          en: 'Formulated with luxury botanicals and proven cosmetic actives for visible clarity and effortless skin harmony.'
        },
        ctaPrimary: { en: 'Explore Formulations' },
        ctaSecondary: { en: 'B2B Trade Inquiries' }
      },
      sections: [
        { id: 'hero', name: 'Hero Showcase', visible: true, order: 1 },
        { id: 'philosophy', name: 'Brand Philosophy', visible: true, order: 2 },
        { id: 'catalog', name: 'Featured Formulations', visible: true, order: 3 },
        { id: 'values', name: 'Brand Values & Commitment', visible: true, order: 4 },
        { id: 'b2b', name: 'B2B Trade & Wholesale', visible: true, order: 5 },
        { id: 'contact', name: 'Contact & Inquiries', visible: true, order: 6 }
      ]
    };

    if (isMockDB) {
      const data = readMockData();
      if (!data.content) {
        data.content = defaultContent;
        writeMockData(data);
      }
      return data.content;
    }
    let content = await CmsContent.findOne().lean();
    if (!content) {
      const newContent = new CmsContent(defaultContent);
      await newContent.save();
      return newContent.toObject();
    }
    return { ...content, id: content._id.toString() };
  },

  async updateCmsContent(contentData: any): Promise<any> {
    if (isMockDB) {
      const data = readMockData();
      data.content = { ...data.content, ...contentData };
      writeMockData(data);
      return data.content;
    }
    let content = await CmsContent.findOne();
    if (!content) {
      content = new CmsContent(contentData);
    } else {
      Object.assign(content, contentData);
    }
    await content.save();
    return content.toObject();
  }
};
