import bcrypt from 'bcryptjs';
import { connectDB, isMockDB, readMockData, writeMockData } from '../config/db';
import User from '../models/User';
import Product from '../models/Product';
import { FAQ, SiteSettings, CmsContent } from '../models/OtherModels';

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

  const products = [
    {
      title: 'Crown Whitening Beauty Cream',
      slug: 'crown-whitening-beauty-cream',
      category: 'Creams',
      size: '20g | 0.7 oz',
      status: 'active',
      images: ['/images/crown_whitening_cream.jpg'],
      shortDescription: 'Signature botanical night treatment for visible clarity, tone balance, and radiance.',
      description:
        'COSMALAC Crown Whitening Beauty Cream is an iconic formulation crafted with over 9 years of skincare trust. Designed to diminish acne marks, stubborn dark spots, and dullness while providing deep, nourishing hydration and a luminous finish without greasy residue.',
      benefits: [
        'Targeted Blemish Clarifying',
        'Gentle Dark Spot Eraser',
        'Non-Greasy Botanical Base',
        'Nighttime Barrier Restorative',
        'Pore-Refining Radiance'
      ],
      ingredients: [
        'Alpha Arbutin',
        'Kojic Acid',
        'Licorice Extract',
        'Vitamin B3 (Niacinamide)',
        'Mulberry Root Extract',
        'Hydrolyzed Marine Collagen'
      ],
      directions:
        'Apply evenly across cleansed face and neck every evening before bed. Massage gently until fully absorbed.',
      warnings:
        'For cosmetic external use only. Avoid direct contact with eyes. Patch test on inner forearm prior to initial use.',
      storage: 'Store in a cool, dry place away from direct sunlight. Keep cap tightly closed.',
      packaging: '20g UV-defending glass container with brushed bronze cap.',
      isFeatured: true,
      isBestseller: true
    },
    {
      title: 'Queen Beauty Cream (8X Night Whitening)',
      slug: 'queen-beauty-cream-8x-night',
      category: 'Night Cream',
      size: '20g | 0.7 oz',
      status: 'active',
      images: ['/images/queen_beauty_cream.jpg'],
      shortDescription: 'High-potency 8X intensive whitening night formulation for stubborn hyperpigmentation.',
      description:
        'COSMALAC Queen Beauty Cream represents our highest-strength night repair complex. Enriched with 8X concentrated brightening botanicals and nano-liposomes for noticeable radiance, elasticity, and tone evening.',
      benefits: [
        '8X Concentrated Whitening Action',
        'Collagen Density & Elasticity',
        'Under-Eye & Melasma Care',
        'Velvety Rapid Absorption',
        'Antioxidant Defense'
      ],
      ingredients: [
        'Snow Lotus Extract',
        'Alpha Arbutin',
        'Hydrolyzed Marine Collagen',
        'Ginseng Root Extract',
        'Nano-Liposomes',
        'Vitamin E Acetate'
      ],
      directions: 'Gently massage a pearl-sized amount onto target blemish areas and neck at night.',
      warnings: 'For external use only. Keep out of reach of children.',
      storage: 'Store below 25°C in a dry environment away from heat.',
      packaging: '20g frosted luxury cosmetic jar with double-seal protective insert.',
      isFeatured: true,
      isBestseller: true
    }
  ];

  const faqs = [
    {
      question: {
        en: 'How do I incorporate Cosmalac creams into my daily routine?',
        si: 'Cosmalac ක්‍රීම් දෛනිකව භාවිතා කරන්නේ කෙසේද?',
        ta: 'காஸ்மலக் கிரீம்களை எவ்வாறு பயன்படுத்துவது?'
      },
      answer: {
        en: 'Cleanse your face thoroughly, then apply a pearl-sized amount of Crown Whitening Cream or Queen 8X Night Cream evenly across your face and neck every evening before bed.',
        si: 'රාත්‍රී නින්දට පෙර මුහුණ හොඳින් පිරිසිදු කර සුළු ප්‍රමාණයක් මුහුණේ සහ බෙල්ලේ ආලේප කරන්න.',
        ta: 'இரவு தூங்குவதற்கு முன் முகத்தை நன்கு கழுவிவிட்டு சிறிதளவு எடுத்து முகம் மற்றும் கழுத்தில் தடவவும்.'
      },
      category: 'Usage'
    },
    {
      question: {
        en: 'Are Cosmalac formulations suitable for sensitive skin?',
        si: 'සංවේදී සමක් ඇති අයට Cosmalac නිෂ්පාදන සුදුසුද?',
        ta: 'சென்சிடிவ் சருமத்திற்கு இது உகந்ததா?'
      },
      answer: {
        en: 'Yes, our formulations are free from harsh bleaches and mercury. We use soothing botanicals like Licorice and Snow Lotus. A 24-hour forearm patch test is recommended before first application.',
        si: 'ඔව්, අපගේ නිෂ්පාදන වල අහිතකර රසායනික ද්‍රව්‍ය අඩංගු නොවන අතර සංවේදී සම සඳහා ආරක්ෂිත වේ.',
        ta: 'ஆம், இதில் தீங்கு விளைவிக்கும் ரசாயனங்கள் இல்லை. சருமத்திற்கு மிகவும் பாதுகாப்பானது.'
      },
      category: 'Safety'
    }
  ];

  const siteSettings = {
    siteName: 'Cosmalac',
    tagline: 'EST. 2016',
    contactEmail: 'info@cosmalac.com',
    contactPhone: '+94 11 234 5678',
    whatsAppNumber: '0779178371',
    address: '123 Beauty Street, Colombo, Sri Lanka',
    businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
    socialLinks: {
      facebook: 'https://facebook.com/cosmalac',
      instagram: 'https://instagram.com/cosmalac'
    }
  };

  const cmsContent = {
    vision: {
      en: 'To be South Asia’s gold standard in skin-nourishing luxury cosmetic formulations.',
      si: 'දකුණු ආසියාවේ ප්‍රමුඛතම සම රැකවරණ ආලේපන සන්නාමය බවට පත්වීම.',
      ta: 'தெற்காசியாவின் முன்னணி சரும பராமரிப்பு வர்த்தக முத்திரையாக திகழ்தல்.'
    },
    mission: {
      en: 'Crafting dermatologically conscious, botanical-driven brightening products that deliver visible results with barrier comfort.',
      si: 'සමට හිතකර උසස් ප්‍රමිතියෙන් යුත් රූපලාවන්‍ය නිෂ්පාදන පාරිභෝගිකයා වෙත ලබාදීම.',
      ta: 'இயற்கையான மற்றும் பாதுகாப்பான சரும பராமரிப்பு தயாரிப்புகளை வழங்குதல்.'
    },
    values: [
      {
        id: 'val_1',
        title: { en: 'Botanical Purity', si: 'උද්භිද සාරය', ta: 'இயற்கை தூய்மை' },
        description: { en: 'Formulated with authentic Alpha Arbutin & rare Snow Lotus extracts.', si: 'ස්වභාවික ශාක සාර අඩංගුයි.', ta: 'இயற்கையான மூலிகை சாறுகள்.' }
      },
      {
        id: 'val_2',
        title: { en: 'Sterile GMP Packaging', si: 'උසස් තත්ත්වයේ ඇසුරුම්', ta: 'தரமான பேக்கிங்' },
        description: { en: 'Sealed in UV-resistant glass jars for maximum active potency.', si: 'ප්‍රමිතියෙන් උසස් වීදුරු බඳුන් වල අසුරා ඇත.', ta: 'பாதுகாப்பான கண்ணாடி கொள்கலன்கள்.' }
      }
    ],
    hero: {
      badge: { en: 'EST. 2016', si: 'ආරම්භය 2016', ta: 'துවக்கம் 2016' },
      title: { en: 'Reveal Your Natural', si: 'ඔබේ ස්වභාවික පැහැපත් බව', ta: 'உங்கள் இயற்கையான பிரகாசத்தை' },
      highlight: { en: 'Radiance', si: 'මතුකරගන්න', ta: 'வெளிப்படுத்துங்கள்' },
      description: {
        en: 'Formulated with luxury botanicals and proven cosmetic actives for visible clarity and effortless skin harmony.',
        si: 'ප්‍රමුඛ පෙළේ උද්භිද සාරය සහ සුවිශේෂී සංයෝග මඟින් ඔබේ සමට නිරෝගී පැහැපත් බවක්.',
        ta: 'ஆடம்பர தாவர சாறுகள் மற்றும் நிரூபிக்கப்பட்ட ஒப்பனை செயல்களுடன் வடிவமைக்கப்பட்டது.'
      },
      ctaPrimary: { en: 'Explore Formulations', si: 'නිෂ්පාදන බලන්න', ta: 'தயாரிப்புகளைப் பார்க்க' },
      ctaSecondary: { en: 'B2B Trade Inquiries', si: 'තොග වෙළඳ විමසීම්', ta: 'மொத்த விற்பனை விசாரණைகள்' }
    },
    sections: [
      { id: 'hero', name: 'Hero Showcase', visible: true, order: 1 },
      { id: 'philosophy', name: 'Brand Philosophy', visible: true, order: 2 },
      { id: 'formulations', name: 'Featured Formulations', visible: true, order: 3 },
      { id: 'commitments', name: 'Brand Values', visible: true, order: 4 },
      { id: 'b2b', name: 'B2B Trade & Wholesale', visible: true, order: 5 },
      { id: 'faq', name: 'FAQ Section', visible: true, order: 6 }
    ]
  };

  if (isMockDB) {
    const data = readMockData();
    data.users = users.map((u, i) => ({ id: `user_${i}`, ...u, createdAt: new Date().toISOString() }));
    data.products = products.map((p, i) => ({ id: `prod_${i}`, ...p, createdAt: new Date().toISOString() }));
    data.faqs = faqs.map((f, i) => ({ id: `faq_${i}`, ...f }));
    data.settings = siteSettings;
    data.cms = cmsContent;

    writeMockData(data);
    console.log('✅ Seeding completed in Local JSON Database file!');
  } else {
    try {
      await User.deleteMany({});
      await User.insertMany(users);

      await Product.deleteMany({});
      await Product.insertMany(products);

      await FAQ.deleteMany({});
      await FAQ.insertMany(faqs);

      await SiteSettings.deleteMany({});
      await SiteSettings.create(siteSettings);

      await CmsContent.deleteMany({});
      await CmsContent.create(cmsContent);

      console.log('✅ Seeding completed in MongoDB database!');
    } catch (err: any) {
      console.error('❌ MongoDB Seeding Error:', err.message);
    }
  }
};

const run = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

run();
