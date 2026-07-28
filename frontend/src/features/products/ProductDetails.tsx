import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Send, Check, ShieldAlert, Sparkles, Box, Info } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import InquiryModal from '../../components/InquiryModal';
import { SEO } from '../../components/SEO';

const MOCK_PRODUCTS = [
  {
    id: 'prod_0',
    title: 'Cosmalac Glow Cream',
    slug: 'cosmalac-glow-cream',
    description: 'Our award-winning daily brightening cream is formulated with a powerful synergy of 5% Niacinamide and 2% Alpha Arbutin. It targets stubborn dark spots, reduces hyperpigmentation, and hydrates the skin deeply for an even, translucent, and glowing complexion. Crafted for all skin types, this non-greasy luxury formula absorbs instantly to lock in moisture and shield skin from environmental stressors.',
    shortDescription: 'Advanced brightening cream with Niacinamide and Alpha Arbutin for a glowing, even skin tone.',
    category: 'Creams',
    ingredients: ['Niacinamide (5%)', 'Alpha Arbutin (2%)', 'Hyaluronic Acid'],
    directions: 'Apply a dime-sized amount to cleansed face and neck in the morning and evening. Gently massage in upward circular motions until fully absorbed. Follow with SPF during the day.',
    warnings: 'For external use only. Avoid direct contact with eyes. Patch test on a small area before full application. Discontinue use if irritation occurs.',
    storage: 'Store in a cool, dry place away from direct sunlight. Keep the lid tightly closed.',
    packaging: '50ml frosted glass luxury jar with custom gold lid, inside a recyclable embossed paper box.',
    images: ['/images/glow_cream_jar.png']
  },
  {
    id: 'prod_1',
    title: 'Cosmalac Hydrating Serum',
    slug: 'cosmalac-hydrating-serum',
    description: 'A highly concentrated hydrator that combines three molecular weights of Hyaluronic Acid with stabilized Vitamin C. This dual-action serum penetrates deep within the skin layers to replenish moisture reserves while providing powerful antioxidant protection. The result is instantly plumped, luminous, and resilient skin with a reduction in fine lines and dark circles.',
    shortDescription: 'Multi-weight Hyaluronic Acid serum infused with Vitamin C for intensive hydration and brightness.',
    category: 'Serums',
    ingredients: ['Hyaluronic Acid', 'Vitamin C (10%)', 'Pro-Vitamin B5'],
    directions: 'Dispense 3-4 drops onto clean fingertips. Press gently into face and neck before applying moisturizers. Suitable for both morning and evening application.',
    warnings: 'A slight tingling sensation is normal due to the active Vitamin C. Keep out of reach of children.',
    storage: 'Store in a cool, dark place. Refrigeration is recommended to maintain Vitamin C stability.',
    packaging: '30ml frosted pink glass dropper bottle with gold collar and rubber bulb.',
    images: ['/images/hydrating_serum_dropper.png']
  }
];

export const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'usage' | 'specs'>('ingredients');

  // Query product details from API
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product-details', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${slug}`);
      return response.data;
    },
    retry: false,
    initialData: MOCK_PRODUCTS.find((p) => p.slug === slug)
  });

  if (isLoading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div class="w-12 h-12 border-4 border-rose-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div class="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-body">
        <h2 class="text-2xl font-bold font-heading text-text-primary">Formulation Not Found</h2>
        <p class="text-sm text-text-secondary">We could not retrieve the details for this formulation.</p>
        <Link to="/products" class="inline-flex items-center gap-1 text-sm text-rose-gold font-semibold uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || '/images/product-placeholder.jpg';

  // Dynamic Product JSON-LD Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.title,
    'image': imageUrl,
    'description': product.shortDescription,
    'brand': {
      '@type': 'Brand',
      'name': 'COSMALAC'
    },
    'category': product.category
  };

  return (
    <>
      <SEO
        title={product.title}
        description={product.shortDescription}
        schema={productSchema}
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-body">
        {/* Back Link */}
        <Link
          to="/products"
          class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-rose-gold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Formulations
        </Link>

        {/* Dual Column Layout */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div class="lg:col-span-5 bg-white border border-border-pink rounded-3xl p-8 aspect-square flex items-center justify-center shadow-sm">
            <img
              src={imageUrl}
              alt={product.title}
              class="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Right Column: Specifications & Forms */}
          <div class="lg:col-span-7 space-y-6 text-left">
            <div class="space-y-3">
              <span class="px-3 py-1 bg-brand-primary/20 border border-brand-primary/40 rounded-full text-xs font-semibold uppercase tracking-wider text-rose-gold inline-block">
                {product.category}
              </span>
              <h1 class="text-3xl sm:text-4xl font-bold text-text-primary font-heading">
                {product.title}
              </h1>
            </div>

            <p class="text-sm sm:text-base text-text-secondary leading-relaxed">
              {product.description}
            </p>

            {/* Tabs Controller */}
            <div class="border-b border-border-pink flex space-x-6 text-xs uppercase tracking-wider font-semibold">
              <button
                onClick={() => setActiveTab('ingredients')}
                class={`pb-3 transition-colors ${
                  activeTab === 'ingredients' ? 'border-b-2 border-rose-gold text-rose-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                class={`pb-3 transition-colors ${
                  activeTab === 'usage' ? 'border-b-2 border-rose-gold text-rose-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Directions
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                class={`pb-3 transition-colors ${
                  activeTab === 'specs' ? 'border-b-2 border-rose-gold text-rose-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Packaging
              </button>
            </div>

            {/* Tab Contents */}
            <div class="min-h-[150px] bg-white border border-border-pink p-6 rounded-2xl shadow-sm text-sm text-text-secondary leading-relaxed">
              {activeTab === 'ingredients' && (
                <div class="space-y-4">
                  <div class="flex items-center gap-1.5 text-text-primary font-semibold">
                    <Sparkles size={16} class="text-rose-gold" /> Active Ingredients Glossary
                  </div>
                  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.ingredients?.map((ing: string, i: number) => (
                      <li key={i} class="flex items-center gap-2 text-xs">
                        <Check size={14} class="text-rose-gold flex-shrink-0" /> {ing}
                      </li>
                    ))}
                  </ul>
                  <p class="text-[11px] leading-relaxed text-muted pt-2 border-t border-border-pink/40">
                    Formulated at precise clinical thresholds. Check our Quality standards page to learn about skin tolerability protocols.
                  </p>
                </div>
              )}

              {activeTab === 'usage' && (
                <div class="space-y-4">
                  <div class="flex items-center gap-1.5 text-text-primary font-semibold">
                    <Info size={16} class="text-rose-gold" /> Directions for Use
                  </div>
                  <p class="text-xs leading-relaxed">{product.directions}</p>
                  
                  {product.warnings && (
                    <div class="p-3 bg-red-50/50 border border-red-100 rounded-lg text-xs flex gap-2 items-start text-red-700">
                      <ShieldAlert size={16} class="flex-shrink-0 mt-0.5" />
                      <div>
                        <strong class="block font-semibold">Cautionary Advisory</strong>
                        {product.warnings}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div class="space-y-4">
                  <div class="flex items-center gap-1.5 text-text-primary font-semibold">
                    <Box size={16} class="text-rose-gold" /> Packaging & Storage Specs
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-muted mb-0.5">Primary Container</span>
                      <p class="text-text-primary">{product.packaging || 'Airless luxury pump / Frosted glass jar'}</p>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-muted mb-0.5">Storage Instruction</span>
                      <p class="text-text-primary">{product.storage || 'Keep in cool dry cupboard'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div class="pt-4 flex gap-4">
              <button
                onClick={() => setInquiryOpen(true)}
                class="px-8 py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors duration-300 shadow-sm flex items-center gap-2 group"
              >
                <Send size={12} /> Inquire About Formulation
              </button>
            </div>
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultProductTitle={product.title}
      />
    </>
  );
};

export default ProductDetails;
