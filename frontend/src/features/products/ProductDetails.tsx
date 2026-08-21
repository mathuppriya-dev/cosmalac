import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Send, Check, Sparkles, Box, Info, MessageSquare } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

const DEFAULT_ACTIVE_INGREDIENTS = [
  'Active Whitening Arbutin',
  'Nano-Liposome & Snow Lotus Extract',
  'Kojic Acid Dipalmitate',
  'Hydrolyzed Collagen',
  'Vitamin E & Allantoin',
  'Ginseng Root Extract'
];

const DEFAULT_BENEFITS = [
  'Helps decrease melanin pigment & fade freckles',
  'Soothes inflammatory acne & blemishes',
  'Restores skin firmness & tightens pores',
  'Provides deep, nourishing overnight hydration',
  'Protects against environmental free radicals'
];

const FALLBACK_PRODUCTS_MAP: Record<string, any> = {
  'crown-whitening-beauty-cream': {
    id: 'prod_crown_1',
    slug: 'crown-whitening-beauty-cream',
    title: 'Crown Whitening Beauty Cream',
    category: 'Creams',
    size: '20g | 0.7 oz',
    status: 'active',
    images: ['/images/crown_whitening_cream.jpg'],
    shortDescription: 'Signature botanical night treatment for visible clarity, tone balance, and radiance.',
    description: 'COSMALAC Crown Whitening Beauty Cream is an iconic formulation crafted with over 9 years of skincare trust. Designed to diminish acne marks, stubborn dark spots, and dullness while providing deep, nourishing hydration and a luminous finish without greasy residue.',
    benefits: ['Targeted Blemish Clarifying', 'Gentle Dark Spot Eraser', 'Non-Greasy Botanical Base', 'Nighttime Barrier Restorative', 'Pore-Refining Radiance'],
    ingredients: ['Alpha Arbutin', 'Kojic Acid', 'Licorice Extract', 'Vitamin B3', 'Mulberry Root Extract', 'Hydrolyzed Marine Collagen'],
    directions: 'Apply evenly across cleansed face and neck every evening before bed. Massage gently until fully absorbed.',
    warnings: 'For cosmetic external use only. Avoid direct contact with eyes. Patch test on inner forearm prior to initial use.',
    storage: 'Store in a cool, dry place away from direct sunlight. Keep cap tightly closed.',
    packaging: '20g UV-defending amber glass container with brushed bronze cap.',
    isFeatured: true,
    isBestseller: true
  },
  'queen-beauty-cream-8x-night': {
    id: 'prod_queen_2',
    slug: 'queen-beauty-cream-8x-night',
    title: 'Queen Beauty Cream (8X Night Whitening)',
    category: 'Night Cream',
    size: '20g | 0.7 oz',
    status: 'active',
    images: ['/images/queen_beauty_cream.jpg'],
    shortDescription: 'High-potency 8X intensive whitening night formulation for stubborn hyperpigmentation.',
    description: 'COSMALAC Queen Beauty Cream represents our highest-strength night repair complex. Enriched with 8X concentrated brightening botanicals and nano-liposomes for noticeable radiance, elasticity, and tone evening.',
    benefits: ['8X Concentrated Whitening Action', 'Collagen Density & Elasticity', 'Under-Eye & Melasma Care', 'Velvety Rapid Absorption', 'Antioxidant Defense'],
    ingredients: ['Snow Lotus Extract', 'Alpha Arbutin', 'Hydrolyzed Marine Collagen', 'Ginseng Root Extract', 'Nano-Liposomes', 'Vitamin E Acetate'],
    directions: 'Gently massage a pearl-sized amount onto target blemish areas and neck at night.',
    warnings: 'For external use only. Keep out of reach of children.',
    storage: 'Store below 25°C in a dry environment away from heat.',
    packaging: '20g frosted luxury cosmetic jar with double-seal protective insert.',
    isFeatured: true,
    isBestseller: true
  }
};

export const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'benefits' | 'usage' | 'specs'>('ingredients');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Retail / Spa Client',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Fetch product details
  const { data: fetchedProduct, isLoading } = useQuery({
    queryKey: ['product-details', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${slug}`);
      return response.data;
    },
    retry: 1
  });

  // Dynamic WhatsApp Settings
  const { data: settings } = useQuery({
    queryKey: ['public-settings-data'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/settings');
      return res.data;
    }
  });

  // Use fetched product or fallback map
  const product = fetchedProduct || (slug ? FALLBACK_PRODUCTS_MAP[slug] || FALLBACK_PRODUCTS_MAP['crown-whitening-beauty-cream'] : FALLBACK_PRODUCTS_MAP['crown-whitening-beauty-cream']);

  const rawWhatsApp = settings?.whatsAppNumber || '0779178371';
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');
  const formattedWhatsApp = cleanPhone.startsWith('0')
    ? `94${cleanPhone.substring(1)}`
    : cleanPhone.startsWith('94')
    ? cleanPhone
    : `94${cleanPhone}`;

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Cosmalac Team,\n\nI am inquiring about the formulation: *${product?.title}* (${product?.size || 'Standard Size'}).\n\nPlease provide wholesale/retail pricing and product availability.`
    );
    window.open(`https://wa.me/${formattedWhatsApp}?text=${text}`, '_blank');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/inquiries', {
        ...inquiryForm,
        type: 'Product Inquiry',
        productSlug: slug,
        productTitle: product?.title
      });
      setInquirySubmitted(true);
      setTimeout(() => {
        setInquiryModalOpen(false);
        setInquirySubmitted(false);
        setInquiryForm({ name: '', email: '', phone: '', businessType: 'Retail / Spa Client', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Inquiry submission error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F1EFE7]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-rose-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#57534E]">
            Loading Formulation Details...
          </p>
        </div>
      </div>
    );
  }

  // Smart image fallback
  let imageUrl = '/images/crown_whitening_cream.jpg';
  if (product.images && product.images.length > 0 && product.images[0]) {
    imageUrl = product.images[0];
  } else if (slug && slug.includes('queen')) {
    imageUrl = '/images/queen_beauty_cream.jpg';
  }

  const ingredientsList: string[] =
    product.ingredients && Array.isArray(product.ingredients) && product.ingredients.length > 0
      ? product.ingredients
      : DEFAULT_ACTIVE_INGREDIENTS;

  const benefitsList: string[] =
    product.benefits && Array.isArray(product.benefits) && product.benefits.length > 0
      ? product.benefits
      : DEFAULT_BENEFITS;

  return (
    <>
      <SEO
        title={`${product.title} | COSMALAC Formulation`}
        description={product.shortDescription || product.description}
      />

      <div className="bg-[#F1EFE7] min-h-screen text-left font-body pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-rose-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Formulations Catalog
          </Link>
        </div>

        {/* Main Product Showcase Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Product Photography */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square bg-[#F1EFE7]/40 rounded-3xl border border-[#D8D2C8]/70 p-6 flex items-center justify-center relative overflow-hidden shadow-inner group">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/crown_whitening_cream.jpg';
                  }}
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs border border-[#D8D2C8] text-[10px] font-extrabold uppercase tracking-widest text-[#121110] rounded-full shadow-2xs">
                  {product.category || 'Creams'}
                </span>
                {product.isBestseller && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37] text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-2xs">
                    Bestseller
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#78716C] text-center font-medium">
                * Authentic COSMALAC sealed packaging with security batch label.
              </p>
            </div>

            {/* Right Column: Specification & Action CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1EFE7] border border-[#D8D2C8] rounded-full text-[10px] font-bold uppercase tracking-wider text-rose-gold">
                  <Sparkles size={12} /> Laboratory Perfected Since 2016
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121110] font-heading tracking-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-[#57534E] font-bold">
                  Net Wt: <span className="text-[#121110]">{product.size || '20g | 0.7 oz'}</span>
                </p>
              </div>

              {/* Formulation Description */}
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-medium">
                {product.description || product.shortDescription}
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Instant WhatsApp Inquiry
                </button>

                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#121110] hover:bg-rose-gold text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Send Official Trade Lead
                </button>
              </div>

              {/* Formulation Specs Navigation Tabs */}
              <div className="pt-6 border-t border-[#D8D2C8]/70 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-1 overflow-x-auto">
                  {(['ingredients', 'benefits', 'usage', 'specs'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[5px] ${
                        activeTab === tab
                          ? 'border-rose-gold text-[#121110]'
                          : 'border-transparent text-[#78716C] hover:text-[#121110]'
                      }`}
                    >
                      {tab === 'ingredients'
                        ? 'Key Actives'
                        : tab === 'benefits'
                        ? 'Targeted Benefits'
                        : tab === 'usage'
                        ? 'Application Guide'
                        : 'Packaging Specs'}
                    </button>
                  ))}
                </div>

                {/* Tab Content 1: Key Active Ingredients */}
                {activeTab === 'ingredients' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-[#57534E] font-medium">
                      Concentrated bioactive agents selected for proven efficacy and dermatological comfort:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ingredientsList.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs font-bold text-[#121110]"
                        >
                          <Sparkles size={14} className="text-rose-gold shrink-0" />
                          <span>{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab Content 2: Targeted Benefits */}
                {activeTab === 'benefits' && (
                  <div className="space-y-2.5 animate-fade-in">
                    {benefitsList.map((ben, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs font-medium text-[#121110]"
                      >
                        <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Content 3: Application Guide */}
                {activeTab === 'usage' && (
                  <div className="space-y-3 p-4 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-2xl text-xs animate-fade-in">
                    <div>
                      <h5 className="font-bold text-[#121110] mb-1">Directions for Use</h5>
                      <p className="text-[#57534E] leading-relaxed">
                        {product.directions ||
                          'Apply evenly across cleansed face and neck every evening before bed. Massage gently in upward circular motions.'}
                      </p>
                    </div>
                    {product.warnings && (
                      <div className="pt-2 border-t border-[#D8D2C8]">
                        <h5 className="font-bold text-[#121110] mb-1">Caution</h5>
                        <p className="text-[#57534E] leading-relaxed">{product.warnings}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content 4: Packaging Specs */}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-fade-in">
                    <div className="p-3 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#78716C] flex items-center gap-1">
                        <Box size={12} /> Packaging Specification
                      </span>
                      <p className="font-bold text-[#121110]">
                        {product.packaging || '20g Sealed UV Glass Container'}
                      </p>
                    </div>
                    <div className="p-3 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#78716C] flex items-center gap-1">
                        <Info size={12} /> Storage Conditions
                      </span>
                      <p className="font-bold text-[#121110]">
                        {product.storage || 'Store in a cool, dry place away from heat'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Modal */}
        {inquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setInquiryModalOpen(false)}
            />

            <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl space-y-5 text-xs text-left">
              <div className="border-b border-[#D8D2C8] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-gold block">
                  Official Trade Lead
                </span>
                <h3 className="text-xl font-extrabold text-[#121110] font-heading mt-1">
                  Inquire: {product.title}
                </h3>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <Check size={32} className="text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-950">Inquiry Sent Successfully</h4>
                  <p className="text-xs text-emerald-800">
                    Our formulation specialist will respond within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="e.g. Dr. Sarah Perera"
                      className="w-full px-3.5 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="sarah@clinic.com"
                        className="w-full px-3.5 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        className="w-full px-3.5 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Trade Inquiry Message
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="Please specify order quantity, wholesale pricing inquiries, or questions..."
                      className="w-full px-3.5 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D8D2C8]">
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold uppercase text-[#57534E] hover:text-[#121110]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors shadow-xs"
                    >
                      Submit Lead
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
