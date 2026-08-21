import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  ChevronDown,
  Sparkles,
  Award,
  Droplets,
  Layers,
  MessageSquare,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import ScrollTextReveal from '../../components/ScrollTextReveal';
import { SEO, getOrgSchema } from '../../components/SEO';

const ACTIVE_INGREDIENTS = [
  {
    name: 'Alpha Arbutin',
    tag: 'Melanin Inhibition',
    description: 'A botanical-derived brightening agent that inhibits tyrosinase activity to visibly fade dark spots and acne blemishes without barrier disruption.',
    icon: Sparkles
  },
  {
    name: 'Nano-Liposome & Snow Lotus',
    tag: 'Deep Cellular Repair',
    description: 'Microscopic lipid spheres that deliver rare Snow Lotus extracts deep into the dermal layers to soothe inflammatory blemishes and accelerate recovery.',
    icon: Droplets
  },
  {
    name: 'Kojic Acid & Niacinamide',
    tag: 'Even Tone & Clarity',
    description: 'Synergistic pairing that blocks hyperpigmentation transfer, refines skin texture, and enhances epidermal moisture retention.',
    icon: Layers
  },
  {
    name: 'Collagen & Ginseng Extract',
    tag: 'Nightly Firming',
    description: 'Restores skin elasticity, tightens open pores, and defends against daily free-radical stress while you rest.',
    icon: Award
  }
];

export const Home = () => {
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  // Fetch dynamic CMS content from backend (Refreshes instantly on focus / updates)
  const { data: cmsContent } = useQuery({
    queryKey: ['public-cms-content'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/content');
      return res.data;
    }
  });

  // Fetch products from REST API
  const { data: products = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products');
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

  // Fetch FAQs
  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs-home'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cms/faqs');
      return response.data;
    },
    initialData: [
      {
        question: 'Are Cosmalac products safe for sensitive and combination skin?',
        answer: 'Yes. Both Crown Whitening Beauty Cream and Queen 8X Night Cream are formulated without parabens, harsh bleaches, or damaging alcohols. We combine active brightening ingredients with soothing botanical lipids to maintain skin barrier balance.'
      },
      {
        question: 'What makes Crown Whitening Beauty Cream and Queen 8X Night Cream unique?',
        answer: 'Our formulations combine Alpha Arbutin, Kojic Acid, and Nano-Liposome Snow Lotus extracts to inhibit excess melanin production while delivering intensive nightly nourishment for dark spots, blemishes, and dullness.'
      },
      {
        question: 'How do spas, beauty salons, and distributors request wholesale catalog pricing?',
        answer: 'Verified retail and wellness partners can visit our B2B Trade portal or contact our dedicated WhatsApp trade desk for immediate catalog dispatches and tiered wholesale rates.'
      }
    ]
  });

  const toggleFaq = (idx: number) => {
    setFaqOpenIdx(faqOpenIdx === idx ? null : idx);
  };

  // Helper to check section visibility configured from CMS
  const isSectionVisible = (sectionId: string) => {
    if (!cmsContent?.sections) return true;
    const sec = cmsContent.sections.find((s: any) => s.id === sectionId);
    return sec ? sec.visible !== false : true;
  };

  const heroBadge = cmsContent?.hero?.badge?.en || 'EST. 2016';
  const heroTitle = cmsContent?.hero?.title?.en || 'Reveal Your Natural';
  const heroHighlight = cmsContent?.hero?.highlight?.en || 'Radiance';
  const heroDesc =
    cmsContent?.hero?.description?.en ||
    'Formulated with luxury botanicals and proven cosmetic actives for visible clarity and effortless skin harmony.';
  const ctaPrimaryText = cmsContent?.hero?.ctaPrimary?.en || 'Explore Formulations';
  const ctaSecondaryText = cmsContent?.hero?.ctaSecondary?.en || 'B2B Trade Inquiries';

  // Dynamic Pillars
  const defaultPillars = [
    { title: 'Since 2016', desc: 'Over 9 Years of Skincare Trust', icon: Calendar },
    { title: 'Targeted Radiance', desc: 'Visible Clarity & Tone Balance', icon: Sparkles },
    { title: 'Barrier Comfort', desc: 'Rich Botanical Night Lipids', icon: ShieldCheck },
    { title: 'B2B Verified', desc: 'Wholesale Distributor Network', icon: Award }
  ];

  const displayPillars = cmsContent?.values && cmsContent.values.length === 4
    ? cmsContent.values.map((v: any, i: number) => ({
        title: v.title?.en || defaultPillars[i].title,
        desc: v.description?.en || defaultPillars[i].desc,
        icon: defaultPillars[i].icon
      }))
    : defaultPillars;

  return (
    <>
      <SEO
        title="COSMALAC | Luxury Skincare & Formulation Showcase"
        description="Discover Cosmalac luxury skincare. Featuring our signature Crown Whitening Beauty Cream and Queen Beauty Cream 8X Night Whitening Cream."
        schema={getOrgSchema()}
      />

      <div className="font-body text-left bg-[#F1EFE7] min-h-screen">
        {/* ================= 1. DYNAMIC HERO WITH ENHANCED EDGE TRANSPARENCY ================= */}
        {isSectionVisible('hero') && (
          <section className="relative w-full min-h-[95vh] flex flex-col justify-between overflow-hidden bg-[#F6F3EC]">
            {/* Seamless Multi-Directional Edge Transparency Mask */}
            <div
              className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] h-full pointer-events-none z-0 overflow-hidden flex items-center justify-end"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 6%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,0.9) 36%, black 50%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.7) 10%, black 22%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 8%, black 18%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 6%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,0.9) 36%, black 50%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.7) 10%, black 22%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 8%, black 18%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'destination-in'
              }}
            >
              <img
                src="/images/luxury_skincare_hero.png"
                alt="Cosmalac Luxury Skincare Collection"
                className="w-full h-full object-cover lg:object-contain object-right-bottom scale-100 lg:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Top Floating Navbar Spacer */}
            <div className="pt-24 z-10" />

            {/* Left-Aligned Headline Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full z-10 py-10 flex-grow flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-lg lg:max-w-md xl:max-w-xl space-y-6 text-[#121110] text-left"
              >
                {/* Est Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-[#D8D2C8] rounded-md shadow-2xs text-[11px] font-bold uppercase tracking-wider text-[#D8A7B1]">
                  <Calendar size={12} /> {heroBadge}
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.12] text-[#121110]">
                  {heroTitle} <br />
                  <span className="italic font-serif font-normal text-[#D8A7B1] tracking-normal">
                    {heroHighlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-medium">
                  {heroDesc}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/products"
                    className="px-8 py-3.5 bg-[#121110] hover:bg-rose-gold text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm flex items-center gap-2 group"
                  >
                    {ctaPrimaryText}
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>

                  <Link
                    to="/b2b"
                    className="px-8 py-3.5 bg-white border border-[#D8D2C8] hover:border-rose-gold text-[#121110] text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-2xs"
                  >
                    {ctaSecondaryText}
                  </Link>
                </div>

                {/* Lightweight Interactive Social Channel Pills */}
                <div className="pt-3 flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                    Connect:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://instagram.com/cosmalac"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white border border-[#D8D2C8] text-[#121110] hover:text-rose-gold text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs group"
                    >
                      <Instagram size={13} className="text-rose-gold group-hover:scale-110 transition-transform" />
                      <span>Instagram</span>
                    </a>

                    <a
                      href="https://facebook.com/cosmalac"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white border border-[#D8D2C8] text-[#121110] hover:text-rose-gold text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs group"
                    >
                      <Facebook size={13} className="text-rose-gold group-hover:scale-110 transition-transform" />
                      <span>Facebook</span>
                    </a>

                    <a
                      href={`https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
                        'Hello Cosmalac Team, I am visiting the website and would like to inquire about your luxury skincare formulations.'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white border border-[#D8D2C8] text-[#121110] hover:text-emerald-700 text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs group"
                    >
                      <MessageSquare size={13} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Bar: 01 / 03 Pagination & Scroll Cue */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full z-10 pb-8 pt-4 flex items-end justify-between text-[#57534E] text-xs font-bold uppercase tracking-widest border-t border-[#D8D2C8]/70">
              {/* Left Pagination */}
              <div className="flex items-center gap-3">
                <span className="w-[1.5px] h-4 bg-rose-gold inline-block" />
                <span className="text-xs text-[#121110] font-mono font-bold">01</span>
                <span className="text-[11px] text-[#57534E] font-mono">03</span>
              </div>

              {/* Center Scroll to Discover */}
              <a
                href="#heritage-section"
                className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-[#57534E] hover:text-[#121110] transition-colors cursor-pointer"
              >
                <span>Scroll to Discover</span>
                <ChevronDown size={14} className="animate-bounce text-rose-gold" />
              </a>

              {/* Right Brand Tagline */}
              <div className="hidden sm:block text-[10px] tracking-widest text-[#78716C] font-semibold">
                LUXURY FORMULATIONS
              </div>
            </div>
          </section>
        )}

        {/* ================= 2. DYNAMIC BRAND PILLARS ================= */}
        {isSectionVisible('values') && (
          <section id="heritage-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 bg-white border border-[#D8D2C8] rounded-3xl p-6 md:p-8 shadow-xs">
              {displayPillars.map((pillar: any, idx: number) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center p-3">
                    <Icon className="text-rose-gold mb-3" size={28} />
                    <h3 className="text-sm font-bold text-[#121110] uppercase tracking-wider mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#57534E] font-medium">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= 3. SCROLL-DRIVEN WORD-BY-WORD TEXT REVEAL ================= */}
        {isSectionVisible('philosophy') && (
          <section className="bg-[#EBE7DC]/60 border-t border-b border-[#D8D2C8] py-10 my-10">
            <ScrollTextReveal
              text="Every woman deserves radiant, healthy skin that inspires timeless confidence. At Cosmalac, our formulations pair pure botanical nourishment with proven active performance for effortless beauty."
            />
          </section>
        )}

        {/* ================= 4. 4-PER-ROW PRODUCT SHOWCASE ================= */}
        {isSectionVisible('catalog') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
                Core Formulation Line
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#121110]">
                Signature Beauty Creams
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-medium">
                Explore our signature client formulations, each tailored for noticeable hyperpigmentation reduction, blemish relief, and deep nightly hydration.
              </p>
            </div>

            {/* 4 Products per Row Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {products.map((product: any) => (
                <ProductCard key={product.id || product._id || product.slug} product={product} />
              ))}
            </div>

            <div className="text-center pt-6">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-[#121110] text-[#F1EFE7] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors duration-300 shadow-sm inline-flex items-center gap-2"
              >
                Browse Complete Showcase <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        {/* ================= 5. FORMULATION SCIENCE & ACTIVES MATRIX ================= */}
        <section className="bg-white border-t border-b border-[#D8D2C8] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
                Formulation Science
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#121110]">
                Proven Cosmetic Actives
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-medium">
                Our dermatological approach blends laboratory actives with rare botanical lipids to achieve visible brightening without skin irritation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ACTIVE_INGREDIENTS.map((ing, idx) => {
                const Icon = ing.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-3xl space-y-3 hover:border-rose-gold transition-all duration-300 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-[#D8D2C8] text-rose-gold flex items-center justify-center shadow-2xs">
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-rose-gold block">
                        {ing.tag}
                      </span>
                      <h4 className="text-base font-bold text-[#121110] font-heading">
                        {ing.name}
                      </h4>
                      <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                        {ing.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 6. B2B & DIRECT WHATSAPP CONCIERGE ================= */}
        {isSectionVisible('b2b') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-[#121110] text-[#F1EFE7] rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-3 max-w-xl text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
                  Commercial Partnerships & Salons
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  Authorized Wholesale & Distribution
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  Are you a wellness spa, salon owner, or regional cosmetic distributor? Partner with Cosmalac for verified batch purity, tiered pricing, and direct factory dispatch.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
                <a
                  href={`https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
                    'Hello Cosmalac Team, I would like to inquire about B2B Wholesale distribution and catalog pricing.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors duration-300 shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> WhatsApp Fast-Track
                </a>

                <Link
                  to="/b2b"
                  className="px-7 py-3.5 bg-rose-gold text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-[#121110] transition-colors duration-300 shadow-sm text-center"
                >
                  Apply for Wholesale
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ================= 7. ACCORDION FAQS ================= */}
        {isSectionVisible('contact') && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
                Questions & Answers
              </span>
              <h2 className="text-3xl font-bold font-heading text-[#121110]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-[#D8D2C8] bg-white rounded-2xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#121110] hover:bg-[#EBE7DC]/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-rose-gold shrink-0 transition-transform duration-300 ml-3 ${
                        faqOpenIdx === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      faqOpenIdx === idx ? 'max-h-48 border-t border-[#D8D2C8]/60' : 'max-h-0'
                    }`}
                  >
                    <p className="p-5 text-xs text-[#57534E] leading-relaxed bg-[#F1EFE7]/50 font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
