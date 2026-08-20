import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Compass, Target, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { SEO } from '../components/SEO';

const TIMELINE_MILESTONES = [
  {
    year: '2016',
    title: 'Founding of COSMALAC',
    description: 'Established with a vision to craft premium, clean beauty care and brightening creams for radiant skin.'
  },
  {
    year: '2019',
    title: 'Brand Growth & Formulations',
    description: 'Expanded our beauty catalog with enriched botanical extracts and targeted cosmetic actives.'
  },
  {
    year: '2022',
    title: 'Signature Night Care Debut',
    description: 'Introduced targeted brightening creams tailored for blemishes, dark spots, and nightly rejuvenation.'
  },
  {
    year: '2025',
    title: 'Retail & Wellness Partnerships',
    description: 'Partnered with premier salons, spas, and distributor networks across regional markets.'
  }
];

export const About = () => {
  // Fetch dynamic CMS content from backend
  const { data: cmsContent } = useQuery({
    queryKey: ['public-cms-content'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/content');
      return res.data;
    }
  });

  const visionText =
    cmsContent?.vision?.en ||
    'To become a global benchmark for clean, scientific skin brightening, proving that high-end beauty and clinical safety can coexist seamlessly.';

  const missionText =
    cmsContent?.mission?.en ||
    'To formulate luxurious, skin-friendly beauty solutions that restore natural confidence, combining enriching botanical care with targeted cosmetic performance.';

  return (
    <>
      <SEO
        title="Our Story & Skincare Heritage | COSMALAC"
        description="Discover the story of Cosmalac. Established in 2016, we create luxurious, nourishing skincare formulations designed to reveal your natural glow."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 font-body text-left bg-[#F1EFE7]">
        {/* ================= 1. UNFRAMED NATURAL ABOUT HERO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#D8D2C8] rounded-full text-xs font-bold uppercase tracking-wider text-rose-gold shadow-2xs">
              <Calendar size={12} /> Established 2016
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#121110] font-heading leading-tight">
              Crafted for Your <br />
              <span className="text-rose-gold italic">Natural Radiance</span>
            </h1>
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-medium">
              Cosmalac was founded on a simple belief: every woman deserves to feel confident, radiant, and comfortable in her own skin. We combine nourishing botanical extracts with luxurious textures to create skincare that feels as delightful as it is transformative.
            </p>
            <p className="text-sm text-[#57534E] leading-relaxed font-medium">
              From our signature night care creams to daily brightening blends, our focus remains on thoughtful formulation, skin barrier harmony, and visible beauty outcomes.
            </p>
          </motion.div>

          {/* Right Column: Unframed Product Image sitting naturally on the page */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <img
              src="/images/luxury_skincare_hero.png"
              alt="Cosmalac Luxury Skincare Story"
              className="w-full max-w-lg h-auto object-contain drop-shadow-xl select-none pointer-events-none"
            />
          </motion.div>
        </div>

        {/* ================= 2. DYNAMIC VISION & MISSION CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[#D8D2C8] p-8 rounded-3xl space-y-4 shadow-xs hover:border-rose-gold transition-colors"
          >
            <Target className="text-rose-gold" size={28} />
            <h3 className="text-lg font-bold text-[#121110] font-heading">
              Our Mission
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              {missionText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-[#D8D2C8] p-8 rounded-3xl space-y-4 shadow-xs hover:border-rose-gold transition-colors"
          >
            <Compass className="text-rose-gold" size={28} />
            <h3 className="text-lg font-bold text-[#121110] font-heading">
              Our Vision
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              {visionText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-[#D8D2C8] p-8 rounded-3xl space-y-4 shadow-xs hover:border-rose-gold transition-colors"
          >
            <ShieldCheck className="text-rose-gold" size={28} />
            <h3 className="text-lg font-bold text-[#121110] font-heading">
              Our Core Values
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              Care, transparency, skin comfort, and uncompromising luxury. We craft every product with attention to sensory delight and genuine skin harmony.
            </p>
          </motion.div>
        </section>

        {/* ================= 3. RESTORED LEFT-TO-CENTER ALTERNATING TIMELINE ANIMATION ================= */}
        <section className="space-y-16 py-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
              Heritage Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#121110]">
              Our Journey Since 2016
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-xl mx-auto font-medium">
              A timeline of dedication, active skincare innovation, and regional distributor partnerships.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Vertical Track Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rose-gold via-[#D8D2C8] to-rose-gold md:-translate-x-1/2" />

            <div className="space-y-12">
              {TIMELINE_MILESTONES.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? 'md:flex-row-reverse' : ''
                    } gap-8`}
                  >
                    {/* Content Card */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0">
                      <div
                        className={`bg-white border border-[#D8D2C8] p-6 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 space-y-2 group ${
                          isEven ? 'md:mr-8 md:text-right' : 'md:ml-8 md:text-left'
                        }`}
                      >
                        <span className="inline-block px-3 py-1 bg-rose-gold/15 text-rose-gold rounded-full text-xs font-extrabold font-mono tracking-wider">
                          {milestone.year}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[#121110] font-heading group-hover:text-rose-gold transition-colors">
                          {milestone.title}
                        </h3>
                        <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Center Animated Node */}
                    <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white bg-rose-gold shadow-md flex items-center justify-center z-10">
                      <Sparkles size={12} className="text-white" />
                    </div>

                    {/* Empty Space for Grid Symmetry on Desktop */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 4. BRAND COMMITMENT ================= */}
        <section className="bg-white border border-[#D8D2C8] rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          <div className="lg:col-span-8 space-y-4 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
              Brand Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#121110]">
              "Every Woman Deserves Skin Confidence"
            </h2>
            <p className="text-sm text-[#57534E] italic leading-relaxed font-medium">
              "At Cosmalac, we believe beauty rituals should be calming, luxurious, and dependable. By combining proven active ingredients with gentle nourishing bases, our formulations deliver healthy radiance without harsh compromises."
            </p>
            <h4 className="text-xs font-bold text-[#121110]">
              — Cosmalac Skincare Team
            </h4>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-28 h-28 rounded-full bg-rose-gold/15 border border-rose-gold/30 flex items-center justify-center shadow-xs">
              <Heart size={38} className="text-rose-gold" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
