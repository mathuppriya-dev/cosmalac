import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, Beaker, Star, Layers, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import InquiryModal from '../../components/InquiryModal';
import { SEO, getOrgSchema } from '../../components/SEO';

// Pre-defined fallback products for immediate offline visual presentation
const MOCK_PRODUCTS = [
  {
    id: 'prod_0',
    title: 'Cosmalac Glow Cream',
    slug: 'cosmalac-glow-cream',
    shortDescription: 'Advanced brightening cream with Niacinamide and Alpha Arbutin for a glowing, even skin tone.',
    category: 'Creams',
    images: ['/images/glow_cream_jar.png'],
    isFeatured: true,
    isBestseller: true
  },
  {
    id: 'prod_1',
    title: 'Cosmalac Hydrating Serum',
    slug: 'cosmalac-hydrating-serum',
    shortDescription: 'Multi-weight Hyaluronic Acid serum infused with Vitamin C for intensive hydration and brightness.',
    category: 'Serums',
    images: ['/images/hydrating_serum_dropper.png'],
    isFeatured: true,
    isBestseller: false
  }
];

export const Home = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  // Fetch featured products from REST API
  const { data: products } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products?isFeatured=true');
      return response.data;
    },
    initialData: MOCK_PRODUCTS
  });

  // Fetch FAQs
  const { data: faqs } = useQuery({
    queryKey: ['faqs-home'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cms/faqs');
      return response.data;
    },
    initialData: [
      {
        question: 'Are Cosmalac products safe for sensitive skin?',
        answer: 'Yes, all Cosmalac products are formulated without parabens, synthetic fragrances, or harsh alcohol. We focus on gentle active concentrations combined with barrier-supporting ingredients (like Hyaluronic Acid) and undergo rigorous dermatological testing to minimize any risk of irritation.'
      },
      {
        question: 'What makes the Glow Cream so effective for whitening and brightening?',
        answer: 'The Cosmalac Glow Cream utilizes a dual-action whitening mechanism. Alpha Arbutin (2%) actively blocks tyrosinase (the key enzyme in melanin synthesis), while Niacinamide (5%) inhibits the transfer of pigment into skin cells.'
      },
      {
        question: 'How can we apply to become an international Cosmalac distributor?',
        answer: 'Interested retail and distribution partners can fill out our detailed B2B Distributor Inquiry Form on the Contact page. Our executive trade team will review your application and respond within 2-3 business days.'
      }
    ]
  });

  const toggleFaq = (idx: number) => {
    setFaqOpenIdx(faqOpenIdx === idx ? null : idx);
  };

  return (
    <>
      <SEO
        title="Reveal Your Natural Radiance"
        description="Premium skincare solutions crafted with scientifically proven active ingredients. Established in 2016. Explore our clinical creams and B2B distributor details."
        schema={getOrgSchema()}
      />

      <div class="space-y-24 pb-20">
        {/* ================= 1. HERO SECTION ================= */}
        <section class="relative min-h-[90vh] flex items-center justify-between overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary/40 to-bg-primary px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full z-10 py-12">
            {/* Left Texts */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              class="space-y-6 text-left"
            >
              <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/20 border border-brand-primary/40 rounded-full text-xs font-semibold uppercase tracking-wider text-rose-gold font-body">
                <Calendar size={12} /> EST. 2016
              </div>
              <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary font-heading leading-tight">
                Reveal Your <br />
                <span class="text-rose-gold italic">Natural Radiance</span>
              </h1>
              <p class="text-base sm:text-lg text-text-secondary leading-relaxed font-body max-w-xl">
                Premium clinical solutions crafted with scientifically proven active ingredients to nourish, brighten, protect, and enhance your skin.
              </p>

              {/* CTAs */}
              <div class="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  class="px-6 py-3 bg-text-primary text-bg-primary text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors duration-300 shadow-sm flex items-center gap-2 group font-body"
                >
                  Explore Products
                  <ArrowRight size={14} class="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button
                  onClick={() => setInquiryOpen(true)}
                  class="px-6 py-3 bg-white border border-border-pink text-text-primary text-sm font-semibold uppercase tracking-widest rounded-full hover:border-rose-gold transition-colors duration-300 shadow-sm font-body"
                >
                  B2B Trade Inquiry
                </button>
              </div>
            </motion.div>

            {/* Right Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              class="relative flex justify-center lg:justify-end"
            >
              <div class="relative w-full max-w-[450px] aspect-square rounded-full bg-brand-primary/10 flex items-center justify-center animate-float-slow">
                <img
                  src="/images/luxury_skincare_hero.png"
                  alt="Cosmalac Luxury Bottles Showcase"
                  class="w-[85%] h-[85%] object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. TRUST HIGHLIGHTS ================= */}
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-border-pink/55 rounded-3xl p-6 md:p-8 shadow-sm">
            <div class="flex flex-col items-center text-center p-3">
              <Calendar class="text-rose-gold mb-3" size={28} />
              <h3 class="text-sm font-semibold text-text-primary font-body uppercase tracking-wider mb-1">Since 2016</h3>
              <p class="text-xs text-text-secondary font-body">Trusted skincare legacy</p>
            </div>
            <div class="flex flex-col items-center text-center p-3">
              <Beaker class="text-rose-gold mb-3" size={28} />
              <h3 class="text-sm font-semibold text-text-primary font-body uppercase tracking-wider mb-1">Active Science</h3>
              <p class="text-xs text-text-secondary font-body">Formulations that work</p>
            </div>
            <div class="flex flex-col items-center text-center p-3">
              <ShieldCheck class="text-rose-gold mb-3" size={28} />
              <h3 class="text-sm font-semibold text-text-primary font-body uppercase tracking-wider mb-1">ISO Certified</h3>
              <p class="text-xs text-text-secondary font-body">International GMP standard</p>
            </div>
            <div class="flex flex-col items-center text-center p-3">
              <Star class="text-rose-gold mb-3" size={28} />
              <h3 class="text-sm font-semibold text-text-primary font-body uppercase tracking-wider mb-1">Clinical Safety</h3>
              <p class="text-xs text-text-secondary font-body">Dermatologist-tested formulas</p>
            </div>
          </div>
        </section>

        {/* ================= 3. BRAND LEGACY STORY ================= */}
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            class="space-y-6"
          >
            <span class="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body">Our Heritage</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-text-primary font-heading">
              Combining Nature, Science & Skin Health
            </h2>
            <p class="text-sm sm:text-base text-text-secondary leading-relaxed font-body">
              Founded in 2016, Cosmalac set out to formulate clinical-grade whitening and anti-aging therapies that deliver visible efficacy while respecting the skin barrier. 
            </p>
            <p class="text-sm text-text-secondary leading-relaxed font-body">
              We leverage pure natural botanicals and clinically proven compounds like Alpha Arbutin and Niacinamide, engineered in our state-of-the-art sterile manufacturing facility.
            </p>
            <div class="pt-2">
              <Link
                to="/about"
                class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-primary hover:text-rose-gold transition-colors font-body"
              >
                Discover Our Heritage
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          <div class="relative aspect-video rounded-3xl overflow-hidden border border-border-pink shadow-md bg-bg-secondary flex items-center justify-center">
            <img
              src="/images/scientific_skincare_lab.png"
              alt="Cosmalac Cleanroom Laboratory"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* ================= 4. FEATURED RANGE ================= */}
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div class="text-center space-y-3">
            <span class="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body">Our Catalog</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-text-primary font-heading">
              Featured Formulations
            </h2>
            <p class="text-sm text-text-secondary max-w-xl mx-auto font-body">
              Explore our primary medical skincare range, optimized for B2C daily therapy and B2B clinical application.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>

          <div class="text-center pt-4">
            <Link
              to="/products"
              class="px-8 py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors duration-300 font-body shadow-sm"
            >
              Browse Complete Catalog
            </Link>
          </div>
        </section>

        {/* ================= 5. BRAND VALUES ================= */}
        <section class="bg-bg-secondary border-t border-b border-border-pink py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div class="lg:col-span-2 space-y-4">
              <span class="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body font-medium">Standards</span>
              <h2 class="text-3xl font-bold text-text-primary font-heading">Skincare Crafted Without Compromise</h2>
              <p class="text-sm text-text-secondary leading-relaxed font-body max-w-sm">
                Every bottle we produce undergoes strict quality validations to guarantee safety and professional performance.
              </p>
            </div>
            <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 font-body">
              <div class="bg-white p-5 rounded-2xl border border-border-pink/40">
                <Beaker class="text-rose-gold mb-3" size={24} />
                <h4 class="text-sm font-semibold text-text-primary mb-1">Clinical Actives</h4>
                <p class="text-xs text-text-secondary leading-relaxed">Optimum concentrations of Niacinamide & Alpha Arbutin.</p>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-border-pink/40">
                <ShieldCheck class="text-rose-gold mb-3" size={24} />
                <h4 class="text-sm font-semibold text-text-primary mb-1">Zero Irritants</h4>
                <p class="text-xs text-text-secondary leading-relaxed">Free from parabens, sulfates, and synthetic perfumes.</p>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-border-pink/40">
                <Layers class="text-rose-gold mb-3" size={24} />
                <h4 class="text-sm font-semibold text-text-primary mb-1">Barrier Safe</h4>
                <p class="text-xs text-text-secondary leading-relaxed">pH-balanced formulas to support epidermal resilience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. TESTIMONIALS ================= */}
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div class="text-center space-y-3">
            <span class="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body">Endorsements</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-text-primary font-heading">
              What Dermatologists & Clients Say
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 font-body">
            <div class="bg-white border border-border-pink p-6 rounded-2xl space-y-4">
              <div class="flex text-accent-gold gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} class="fill-accent-gold" />)}
              </div>
              <p class="text-sm text-text-secondary italic leading-relaxed">
                "Cosmalac formulations successfully balance active therapeutic ingredients with skin barrier protection. The Glow Cream is my top recommendation for fading hyperpigmentation."
              </p>
              <div>
                <h4 class="text-sm font-semibold text-text-primary">Dr. Sarah Jenkins, MD</h4>
                <p class="text-xs text-rose-gold">Board-Certified Dermatologist</p>
              </div>
            </div>

            <div class="bg-white border border-border-pink p-6 rounded-2xl space-y-4">
              <div class="flex text-accent-gold gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} class="fill-accent-gold" />)}
              </div>
              <p class="text-sm text-text-secondary italic leading-relaxed">
                "We introduced Cosmalac into our professional facial treatments last year, and our clients have seen a remarkable difference in skin texture and radiance. Truly premium skincare."
              </p>
              <div>
                <h4 class="text-sm font-semibold text-text-primary">Priya Perera</h4>
                <p class="text-xs text-rose-gold">Spa & Wellness Manager</p>
              </div>
            </div>

            <div class="bg-white border border-border-pink p-6 rounded-2xl space-y-4">
              <div class="flex text-accent-gold gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} class="fill-accent-gold" />)}
              </div>
              <p class="text-sm text-text-secondary italic leading-relaxed">
                "As a trade distributor, partnering with Cosmalac has been an outstanding experience. Their manufacturing standards are impeccable and catalog presentation builds immediate trust."
              </p>
              <div>
                <h4 class="text-sm font-semibold text-text-primary">Michael Silva</h4>
                <p class="text-xs text-rose-gold">Managing Director, Aura Wellness</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 7. ACCORDION FAQS ================= */}
        <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div class="text-center space-y-2">
            <span class="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body">Support</span>
            <h2 class="text-3xl font-bold text-text-primary font-heading">Frequently Asked Questions</h2>
          </div>

          <div class="space-y-4 font-body">
            {faqs.map((faq: any, idx: number) => (
              <div key={idx} class="border border-border-pink bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  class="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-sm text-text-primary hover:bg-bg-secondary/40 transition-colors"
                >
                  {faq.question}
                  <ChevronDown
                    size={16}
                    class={`text-text-secondary transition-transform duration-300 ${
                      faqOpenIdx === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  class={`transition-all duration-300 overflow-hidden ${
                    faqOpenIdx === idx ? 'max-h-40 border-t border-border-pink' : 'max-h-0'
                  }`}
                >
                  <p class="p-5 text-xs text-text-secondary leading-relaxed bg-bg-primary/20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
};

export default Home;
