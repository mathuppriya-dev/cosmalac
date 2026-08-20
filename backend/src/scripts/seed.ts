import bcrypt from 'bcryptjs';
import { connectDB, isMockDB, readMockData, writeMockData } from '../config/db';
import User from '../models/User';
import Product from '../models/Product';
import { Category, Ingredient, Inquiry, Blog, Testimonial, FAQ, SiteSettings } from '../models/OtherModels';

const seedData = async () => {
  console.log('🌱 Starting database seeding process...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cosmalac.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'CosmalacPremium2026!';

  const passwordHashAdmin = await bcrypt.hash(adminPassword, 10);
  const passwordHashEditor = await bcrypt.hash('CosmalacEditor2026!', 10);
  const passwordHashViewer = await bcrypt.hash('CosmalacViewer2026!', 10);

  const users = [
    { email: adminEmail, passwordHash: passwordHashAdmin, role: 'SuperAdmin' },
    { email: 'editor@cosmalac.com', passwordHash: passwordHashEditor, role: 'Editor' },
    { email: 'viewer@cosmalac.com', passwordHash: passwordHashViewer, role: 'Viewer' }
  ];

  const categories = [
    { name: 'Creams', slug: 'creams', description: 'Premium facial moisturizing and whitening creams' },
    { name: 'Serums', slug: 'serums', description: 'Concentrated science-backed skin serums' },
    { name: 'Cleansers', slug: 'cleansers', description: 'Gentle clarifying face washes' },
    { name: 'Toners', slug: 'toners', description: 'Rebalancing and hydrating toners' }
  ];

  const ingredients = [
    {
      name: 'Niacinamide',
      chemicalName: 'Vitamin B3',
      description: 'A water-soluble vitamin that works with the natural substances in your skin to help visibly minimize enlarged pores, tighten lax pores, improve uneven skin tone, soften fine lines and wrinkles, and diminish dullness.',
      benefits: ['Brightens skin tone', 'Reduces appearance of pores', 'Strengthens skin barrier'],
      clinicalEvidence: 'Numerous double-blind clinical trials demonstrate Niacinamide at 5% concentration significantly reduces hyperpigmentation and skin yellowing after 8 weeks.'
    },
    {
      name: 'Alpha Arbutin',
      chemicalName: '4-Hydroxyphenyl-alpha-D-glucopyranoside',
      description: 'A naturally occurring derivative of hydroquinone extracted from bearberry plants, used for its powerful skin-lightening and whitening capabilities without toxicity or irritation.',
      benefits: ['Fades dark spots', 'Reduces hyperpigmentation', 'Evens skin tone'],
      clinicalEvidence: 'Clinical comparisons show Alpha Arbutin is 9 times more effective than standard Beta-Arbutin in suppressing melanin synthesis.'
    },
    {
      name: 'Hyaluronic Acid',
      chemicalName: 'Sodium Hyaluronate',
      description: 'A powerful humectant naturally found in skin that holds up to 1,000 times its weight in water, helping to plump skin and lock in moisture.',
      benefits: ['Intense hydration', 'Plumps skin cells', 'Smooths fine wrinkles'],
      clinicalEvidence: 'Dermatological studies confirm multi-molecular weight Hyaluronic Acid penetrates deeper epidermal layers for sustained hydration.'
    },
    {
      name: 'Vitamin C',
      chemicalName: 'L-Ascorbic Acid',
      description: 'A potent antioxidant that neutralizes free radicals, boosts collagen production, and brightens dark marks.',
      benefits: ['Fades pigmentation', 'Boosts collagen', 'Protects against UV damage'],
      clinicalEvidence: 'Stabilized Vitamin C at 10% demonstrates a significant increase in skin elasticity and brightness within 4 weeks.'
    }
  ];

  const products = [
    {
      title: 'Crown Whitening Beauty Cream',
      slug: 'crown-whitening-beauty-cream',
      description: 'Every woman deserves to feel confident in her own skin. Crown Beauty Cream is expertly crafted with advanced skincare ingredients and botanical extracts to help improve the appearance of dark spots, blemishes, uneven skin tone, fine lines, and under-eye darkness. Experience skin that looks brighter, smoother, and beautifully radiant with every use. A comprehensive 6-in-1 solution designed for nightly skin rejuvenation.',
      shortDescription: '6-in-1 advanced whitening & beauty solution targeting acne spots, wrinkles, dark spots, and under-eye darkness.',
      category: 'Creams',
      size: '20g | 0.7 oz',
      status: 'active',
      benefits: [
        'Acne Spots Treatment',
        'Fine Lines & Wrinkles Reduction',
        'Black Spots & Blemishes Fading',
        'Dark Spots & Hyperpigmentation Care',
        'Dark Circles Lightening',
        'Under-Eye Darkness Brightening'
      ],
      ingredients: [
        'Alpha Arbutin',
        'Phyllanthus Emblica (Fruit Extract)',
        'Glycyrrhiza Glabra Extract (Licorice)',
        'Sodium Ascorbyl Phosphate',
        'Kojic Acid',
        'Vitamin A Palmitate',
        'Vitamin E Acetate',
        'Vitamin B3 (Niacinamide)',
        'Vitamin D',
        'Avocado Oil',
        'Aloe Vera Extract'
      ],
      directions: 'Apply a small amount evenly to clean, dry skin every night before bed. Use consistently for best results.',
      warnings: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs.',
      storage: 'Store in a cool, dry place away from direct sunlight. Keep the lid tightly closed.',
      packaging: '20g | 0.7 oz luxury glass jar with brushed bronze-gold cap and embossed gold lettering.',
      images: ['/images/crown_whitening_cream.jpg'],
      isFeatured: true,
      isBestseller: true
    },
    {
      title: 'Queen Beauty Cream 8X Whitening Night Cream',
      slug: 'queen-beauty-cream-8x-whitening',
      description: 'Queen Beauty Cream 8X whitening night cream with small particles of Nano-Liposome and special ingredients like Snow lotus extracts that use to treat inflammatory acnes, pus acnes and reduce scar from acnes. With Alpha arbutin and Collagen help to decrease melanin pigment, freckles look brighter, firming pores, smooth skin and moisture. Ginseng extracts help to make skin stronger by protect skin from free radicals. All useful ingredients in Queen Beauty Cream 8X whitening night cream that can make a miracle like brighten and clear skin within 1 week.',
      shortDescription: '8X whitening night cream with Nano-Liposome technology, Snow Lotus extracts, Collagen, and Ginseng for visible radiance.',
      category: 'Creams',
      status: 'active',
      benefits: [
        'Treats inflammatory & pus acnes',
        'Reduces acne scars and blemishes',
        'Decreases melanin pigment for brighter freckles',
        'Firms pores and enhances skin smoothness',
        'Provides intensive overnight hydration',
        'Shields skin against free radicals with Ginseng'
      ],
      ingredients: [
        'Active Whitening Arbutin',
        'Kojic Acid Dipalmitate',
        'Active SunScreen Avobenzone',
        'Benzophenone-3',
        'Octyl Methoxy Cinnamate in creamy base',
        'Snow Lotus Extract',
        'Hydrolyzed Collagen',
        'Ginseng Extract',
        'Allantoin',
        'Vitamin E',
        'Methyl Paraben',
        'Propyl Paraben',
        'BHT',
        'Perfume'
      ],
      directions: 'Apply this cream every day, You will see good results in a week.',
      warnings: 'For external use only. Avoid contact with eyes.',
      storage: 'Store at room temperature in a dry place.',
      packaging: 'Luxury royal midnight blue jar with gold accents. Please recycle save earth.',
      images: ['/images/queen_beauty_cream.jpg'],
      isFeatured: true,
      isBestseller: true
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Jenkins, MD',
      designation: 'Board-Certified Dermatologist, Skin Clinic NY',
      message: 'Cosmalac formulations successfully balance active therapeutic ingredients with skin barrier protection. The Glow Cream is my top B2B recommendation for patients suffering from persistent post-inflammatory hyperpigmentation.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Priya Perera',
      designation: 'Spa & Wellness Manager, Serenity Luxury Spa',
      message: 'We introduced Cosmalac into our professional facial treatments last year, and our clients have seen a remarkable difference in skin texture and radiance. It is a truly luxury skincare brand that delivers real results.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Michael Silva',
      designation: 'Managing Director, Aura Wellness Retailers',
      message: 'As a distributor, partnering with Cosmalac has been an outstanding experience. Their manufacturing standards are impeccable, and their packaging and brand identity make them a top seller in our premium category.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const faqs = [
    {
      question: 'Are Cosmalac products safe for sensitive skin?',
      answer: 'Yes, all Cosmalac products are formulated without parabens, synthetic fragrances, or harsh alcohol. We focus on gentle active concentrations combined with barrier-supporting ingredients (like Hyaluronic Acid) and undergo rigorous dermatological testing to minimize any risk of irritation.',
      category: 'Products'
    },
    {
      question: 'What makes the Glow Cream so effective for whitening and brightening?',
      answer: 'The Cosmalac Glow Cream utilizes a dual-action whitening mechanism. Alpha Arbutin (2%) actively blocks tyrosinase (the key enzyme in melanin synthesis), while Niacinamide (5%) inhibits the transfer of pigment into skin cells. This scientific combination provides visible results within 4 to 8 weeks.',
      category: 'Products'
    },
    {
      question: 'How can we apply to become an international Cosmalac distributor?',
      answer: 'Interested retail and distribution partners can fill out our detailed B2B Distributor Inquiry Form on the Contact page. Our executive trade team will review your application, company profile, and market presence, and respond within 2-3 business days with wholesale catalogs.',
      category: 'Distributors'
    },
    {
      question: 'Are your products cruelty-free?',
      answer: 'Absolutely. Cosmalac is committed to ethical skincare. We do not test our products or ingredients on animals, nor do we commission third-party testing. We hold international cruelty-free certifications.',
      category: 'General'
    }
  ];

  const blogs = [
    {
      title: 'The Science Behind Niacinamide and Alpha Arbutin',
      slug: 'science-behind-niacinamide-and-alpha-arbutin',
      content: '<h3>Understanding Skin Brightening</h3><p>Uneven skin tone and hyperpigmentation are common skin concerns caused by sun exposure, aging, and inflammation. To combat these issues, skincare scientists look at the melanin pathway. Melanin is the pigment that gives skin its color, and its overproduction leads to dark spots.</p><h3>How Alpha Arbutin Works</h3><p>Alpha Arbutin is a natural skin brightener derived from the bearberry plant. It works by inhibiting <em>tyrosinase</em>, the primary enzyme responsible for melanin production. Unlike hydroquinone, Alpha Arbutin releases its active components slowly, making it extremely gentle and safe for long-term use without risk of cell damage.</p><h3>The Role of Niacinamide</h3><p>Niacinamide (Vitamin B3) tackles hyperpigmentation from a different angle. It does not stop melanin production; instead, it prevents the melanosomes (pigment packets) from transferring into the surrounding skin cells (keratinocytes). Furthermore, Niacinamide stimulates ceramides, bolstering the skin barrier.</p><h3>Why They Work Best Together</h3><p>By pairing Alpha Arbutin (which blocks pigment creation) with Niacinamide (which blocks pigment distribution), you create a multi-level defense system. Clinical tests show that using both active ingredients simultaneously results in significantly faster pigment fading and overall brightening than using either alone.</p>',
      excerpt: 'Discover why combining Vitamin B3 (Niacinamide) and Alpha Arbutin is the gold standard for clinical skin brightening and hyperpigmentation control.',
      author: 'Dr. Evelyn Carter, R&D Director',
      bannerImage: '/images/scientific_skincare_lab.png',
      tags: ['Science', 'Ingredients', 'Brightening'],
      isFeatured: true
    },
    {
      title: 'Building a Skincare Routine for Hyperpigmentation',
      slug: 'building-skincare-routine-hyperpigmentation',
      content: '<p>Fading dark spots requires consistency, patience, and the right sequence of active ingredients. A proper skincare routine is structured to maximize product absorption and protect newly brightened skin from UV rays.</p><h3>Step 1: Cleanse</h3><p>Start with a mild, pH-balanced cleanser to remove dirt and prep the skin barrier without drying it out.</p><h3>Step 2: Hydrate with Serum</h3><p>Apply a lightweight hydrating serum containing Hyaluronic Acid. Serum molecules are small and deliver deep hydration, plumping the skin cells.</p><h3>Step 3: Target and Brighten</h3><p>Apply your target treatment, like the Cosmalac Glow Cream. The Niacinamide and Alpha Arbutin will work in tandem to prevent dark spots from appearing.</p><h3>Step 4: Protect (Crucial Step!)</h3><p>UV radiation triggers melanin production immediately. If you do not apply a broad-spectrum SPF 30+ daily, any brightening treatments will be ineffective. Protection is key to maintaining your glow.</p>',
      excerpt: 'A dermatologist-approved step-by-step guide to layers, products, and SPF protection for fading dark marks.',
      author: 'Cosmalac Skincare Team',
      bannerImage: '/images/luxury_skincare_hero.png',
      tags: ['Skincare Routine', 'Hyperpigmentation', 'Guide'],
      isFeatured: false
    }
  ];

  if (isMockDB) {
    const data = readMockData();
    data.users = users.map((u, i) => ({ id: `user_${i}`, ...u, createdAt: new Date().toISOString() }));
    data.categories = categories.map((c, i) => ({ id: `cat_${i}`, ...c }));
    data.ingredients = ingredients.map((ing, i) => ({ id: `ing_${i}`, ...ing }));
    data.products = products.map((p, i) => ({ id: `prod_${i}`, ...p, createdAt: new Date().toISOString() }));
    data.testimonials = testimonials.map((t, i) => ({ id: `test_${i}`, ...t }));
    data.faqs = faqs.map((f, i) => ({ id: `faq_${i}`, ...f }));
    data.blogs = blogs.map((b, i) => ({ id: `blog_${i}`, ...b, publishedAt: new Date().toISOString() }));
    
    writeMockData(data);
    console.log('✅ Seeding completed in Local JSON Database file!');
  } else {
    // MongoDB
    try {
      await User.deleteMany({});
      await User.insertMany(users);

      await Category.deleteMany({});
      await Category.insertMany(categories);

      await Ingredient.deleteMany({});
      await Ingredient.insertMany(ingredients);

      await Product.deleteMany({});
      await Product.insertMany(products);

      await Testimonial.deleteMany({});
      await Testimonial.insertMany(testimonials);

      await FAQ.deleteMany({});
      await FAQ.insertMany(faqs);

      await Blog.deleteMany({});
      await Blog.insertMany(blogs);

      console.log('✅ Seeding completed in MongoDB database!');
    } catch (err: any) {
      console.error('❌ MongoDB Seeding Error:', err.message);
    }
  }
};

// Run seeder
const run = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

run();
