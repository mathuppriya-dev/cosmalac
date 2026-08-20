import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Send, Check, ShieldAlert, Sparkles, Box, Info, MessageSquare } from 'lucide-react';
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
  const { data: product, isLoading, error } = useQuery({
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

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F1EFE7] px-4">
        <div className="text-center max-w-md space-y-4 bg-white border border-[#D8D2C8] p-8 rounded-3xl shadow-sm">
          <ShieldAlert size={40} className="text-rose-gold mx-auto" />
          <h2 className="text-2xl font-bold font-heading text-[#121110]">
            Formulation Not Found
          </h2>
          <p className="text-xs text-[#57534E] leading-relaxed">
            We could not retrieve the details for this formulation. It may have been relocated or updated in our catalog.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-[#121110] text-[#F1EFE7] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Smart image fallback
  let imageUrl = '/images/crown_whitening_cream.jpg';
  if (product.images && product.images.length > 0 && product.images[0]) {
    imageUrl = product.images[0];
  } else {
    const t = (product.title || '').toLowerCase();
    if (t.includes('queen') || t.includes('8x')) {
      imageUrl = '/images/queen_beauty_cream.jpg';
    } else {
      imageUrl = '/images/crown_whitening_cream.jpg';
    }
  }

  const ingredientsList =
    product.ingredients && product.ingredients.length > 0
      ? product.ingredients
      : DEFAULT_ACTIVE_INGREDIENTS;

  const benefitsList =
    product.benefits && product.benefits.length > 0
      ? product.benefits
      : DEFAULT_BENEFITS;

  const directionsText =
    product.directions ||
    'Apply evenly onto thoroughly cleansed skin morning and evening. Gently massage in upward circular motions until fully absorbed. For best results, use consistently as part of your daily skincare ritual.';

  const packagingText =
    product.packaging ||
    `Luxury frosted glass jar with gold accent closure. Net Wt. ${product.size || '30g'}. Dermatologically evaluated and batch certified for barrier purity.`;

  return (
    <>
      <SEO
        title={`${product.title} | COSMALAC Formulation Showcase`}
        description={product.shortDescription || product.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-body text-left bg-[#F1EFE7]">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-rose-gold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Formulations
        </Link>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 bg-white border border-[#D8D2C8] rounded-3xl p-8 aspect-square flex items-center justify-center shadow-xs">
            <img
              src={imageUrl}
              alt={product.title}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/crown_whitening_cream.jpg';
              }}
            />
          </div>

          {/* Right Column: Specifications & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-rose-gold/15 text-rose-gold border border-rose-gold/30 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  {product.category}
                </span>
                {product.size && (
                  <span className="px-3 py-1 bg-white border border-[#D8D2C8] rounded-full text-xs font-bold text-[#121110] inline-block">
                    {product.size}
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-3 py-1 bg-[#D4AF37] text-stone-950 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                    Bestseller
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#121110]">
                {product.title}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Interactive Tabs Controller */}
            <div className="border-b border-[#D8D2C8] flex space-x-6 text-xs uppercase tracking-wider font-bold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 transition-colors shrink-0 ${
                  activeTab === 'ingredients'
                    ? 'border-b-2 border-rose-gold text-rose-gold'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Key Active Ingredients
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`pb-3 transition-colors shrink-0 ${
                  activeTab === 'benefits'
                    ? 'border-b-2 border-rose-gold text-rose-gold'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Key Benefits
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`pb-3 transition-colors shrink-0 ${
                  activeTab === 'usage'
                    ? 'border-b-2 border-rose-gold text-rose-gold'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Directions for Use
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 transition-colors shrink-0 ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-rose-gold text-rose-gold'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Packaging & Specs
              </button>
            </div>

            {/* Tab Contents: Always Filled with Rich Structured Data */}
            <div className="min-h-[160px] bg-white border border-[#D8D2C8] p-6 rounded-2xl shadow-xs text-xs text-[#57534E] leading-relaxed font-medium">
              {/* TAB 1: KEY ACTIVE INGREDIENTS */}
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-[#121110] font-bold text-sm">
                    <Sparkles size={16} className="text-rose-gold" /> Active Ingredients Glossary
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ingredientsList.map((ing: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-[#121110]">
                        <Check size={14} className="text-rose-gold shrink-0" /> {ing}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] leading-relaxed text-[#57534E] pt-2 border-t border-[#D8D2C8]/60">
                    Carefully selected cosmetic actives blended with pure botanical extracts for visible radiance and skin barrier protection.
                  </p>
                </div>
              )}

              {/* TAB 2: KEY BENEFITS */}
              {activeTab === 'benefits' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-[#121110] font-bold text-sm">
                    <Sparkles size={16} className="text-rose-gold" /> Targeted Skincare Outcomes
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefitsList.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-center gap-2.5 bg-[#F1EFE7]/50 p-2.5 rounded-xl border border-[#D8D2C8]/60">
                        <Check size={14} className="text-rose-gold shrink-0" />
                        <span className="font-bold text-[#121110]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TAB 3: DIRECTIONS FOR USE */}
              {activeTab === 'usage' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#121110] font-bold text-sm">
                    <Info size={16} className="text-rose-gold" /> Application Instructions
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                    {directionsText}
                  </p>
                  <div className="p-3 bg-[#F1EFE7]/60 rounded-xl border border-[#D8D2C8] text-[11px] text-[#57534E]">
                    <strong>Note:</strong> For external cosmetic use only. Avoid direct contact with eyes. Patch test before initial use.
                  </div>
                </div>
              )}

              {/* TAB 4: PACKAGING & SPECS */}
              {activeTab === 'specs' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#121110] font-bold text-sm">
                    <Box size={16} className="text-rose-gold" /> Specifications & Quality Standards
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                    {packagingText}
                  </p>
                  <ul className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D8D2C8]/60 text-[11px] font-semibold text-[#121110]">
                    <li>• Paraben-Free Formulation</li>
                    <li>• Zero Harsh Bleaching Agents</li>
                    <li>• Dermatologically Evaluated</li>
                    <li>• Batch Certified Quality</li>
                  </ul>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2 shadow-sm"
              >
                <MessageSquare size={16} /> Inquire via WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="px-8 py-3.5 bg-[#121110] hover:bg-rose-gold text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send size={15} /> Submit Web Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
