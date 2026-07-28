import bcrypt from 'bcryptjs';
import { connectDB, isMockDB, readMockData, writeMockData } from '../config/db';
import User from '../models/User';
import Product from '../models/Product';
import { Category, Ingredient, Inquiry, Blog, Testimonial, FAQ, SiteSettings } from '../models/OtherModels';

const seedData = async () => {
  console.log('🌱 Starting database seeding process...');

  const passwordHashAdmin = await bcrypt.hash('123456', 10);
  const passwordHashEditor = await bcrypt.hash('CosmalacEditor2026!', 10);
  const passwordHashViewer = await bcrypt.hash('CosmalacViewer2026!', 10);

  const users = [
    { email: 'mathuppriyan@gmail.com', passwordHash: passwordHashAdmin, role: 'SuperAdmin' },
    { email: 'editor@cosmalac.com', passwordHash: passwordHashEditor, role: 'Editor' },
    { email: 'viewer@cosmalac.com', passwordHash: passwordHashViewer, role: 'Viewer' }
  ];

  const categories = [
    { name: 'Creams', description: 'Premium facial moisturizing and whitening creams' },
    { name: 'Serums', description: 'Concentrated science-backed skin serums' },
    { name: 'Cleansers', description: 'Gentle clarifying face washes' },
    { name: 'Toners', description: 'Rebalancing and hydrating toners' }
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
      title: 'Cosmalac Glow Cream',
      slug: 'cosmalac-glow-cream',
      description: 'Our award-winning daily brightening cream is formulated with a powerful synergy of 5% Niacinamide and 2% Alpha Arbutin. It targets stubborn dark spots, reduces hyperpigmentation, and hydrates the skin deeply for an even, translucent, and glowing complexion. Crafted for all skin types, this non-greasy luxury formula absorbs instantly to lock in moisture and shield skin from environmental stressors.',
      shortDescription: 'Advanced brightening cream with Niacinamide and Alpha Arbutin for a glowing, even skin tone.',
      category: 'Creams',
      ingredients: ['Niacinamide', 'Alpha Arbutin', 'Hyaluronic Acid'],
      directions: 'Apply a dime-sized amount to cleansed face and neck in the morning and evening. Gently massage in upward circular motions until fully absorbed. Follow with SPF during the day.',
      warnings: 'For external use only. Avoid direct contact with eyes. Patch test on a small area before full application. Discontinue use if irritation occurs.',
      storage: 'Store in a cool, dry place away from direct sunlight. Keep the lid tightly closed.',
      packaging: '50ml frosted glass luxury jar with custom gold lid, inside a recyclable embossed paper box.',
      images: ['/images/glow_cream_jar.png'],
      isFeatured: true,
      isBestseller: true
    },
    {
      title: 'Cosmalac Hydrating Serum',
      slug: 'cosmalac-hydrating-serum',
      description: 'A highly concentrated hydrator that combines three molecular weights of Hyaluronic Acid with stabilized Vitamin C. This dual-action serum penetrates deep within the skin layers to replenish moisture reserves while providing powerful antioxidant protection. The result is instantly plumped, luminous, and resilient skin with a reduction in fine lines and dark circles.',
      shortDescription: 'Multi-weight Hyaluronic Acid serum infused with Vitamin C for intensive hydration and brightness.',
      category: 'Serums',
      ingredients: ['Hyaluronic Acid', 'Vitamin C'],
      directions: 'Dispense 3-4 drops onto clean fingertips. Press gently into face and neck before applying moisturizers. Suitable for both morning and evening application.',
      warnings: 'A slight tingling sensation is normal due to the active Vitamin C. Keep out of reach of children.',
      storage: 'Store in a cool, dark place. Refrigeration is recommended to maintain Vitamin C stability.',
      packaging: '30ml frosted pink glass dropper bottle with gold collar and rubber bulb.',
      images: ['/images/hydrating_serum_dropper.png'],
      isFeatured: true,
      isBestseller: false
    },
    {
      title: 'Cosmalac Clarifying Cleanser',
      slug: 'cosmalac-clarifying-cleanser',
      description: 'Formulated with organic botanicals and gentle surfactants, this pH-balanced facial cleanser melts away makeup, oil, and impurities without stripping vital moisture. Enriched with green tea extract, it calms redness while prepping the skin for serum absorption.',
      shortDescription: 'Gentle, hydrating, and pH-balanced daily facial wash.',
      category: 'Cleansers',
      ingredients: ['Hyaluronic Acid'],
      directions: 'Lather a small pump in damp palms and massage gently onto wet skin in circular motions. Rinse thoroughly with lukewarm water.',
      warnings: 'Avoid eye area. If contact occurs, rinse immediately.',
      storage: 'Store at room temperature.',
      packaging: '150ml blush pink pump bottle.',
      images: ['/images/scientific_cleanser.png'],
      isFeatured: false,
      isBestseller: false
    },
    {
      title: 'Cosmalac Balancing Toner',
      slug: 'cosmalac-balancing-toner',
      description: 'A lightweight, alcohol-free toner that refines pores, balances skin pH, and provides an initial layer of hydration. Infused with 2% Niacinamide and rose hydrosol to soothe irritation and brighten skin.',
      shortDescription: 'Alcohol-free pore-refining toner with Niacinamide and rose extract.',
      category: 'Toners',
      ingredients: ['Niacinamide'],
      directions: 'After cleansing, apply onto face with a cotton pad or sweep hands gently over face. Let absorb.',
      warnings: 'Avoid contact with eyes.',
      storage: 'Keep in dry cupboard.',
      packaging: '100ml frosted glass bottle.',
      images: ['/images/balancing_toner.png'],
      isFeatured: false,
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
    data.categories = categories.map((c, i) => ({ id: `cat_${i}`, slug: c.name.toLowerCase(), ...c }));
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
