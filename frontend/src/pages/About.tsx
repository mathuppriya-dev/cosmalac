import { motion } from 'framer-motion';
import { Calendar, Compass, Target, ShieldCheck, Heart } from 'lucide-react';
import { SEO } from '../components/SEO';

const TIMELINE_MILESTONES = [
  {
    year: '2016',
    title: 'Establishment of COSMALAC',
    description: 'Founded with a clear focus on introducing pharmaceutical-grade active ingredients to daily cosmetics.'
  },
  {
    year: '2019',
    title: 'ISO & GMP Certifications',
    description: 'Achieved ISO 22716 certification for Good Manufacturing Practices (GMP) in cosmetics production.'
  },
  {
    year: '2022',
    title: 'Clinical Actives Launch',
    description: 'Introduced our hyperpigmentation line featuring stable Alpha Arbutin and Niacinamide complexes.'
  },
  {
    year: '2025',
    title: 'Global Export Partnerships',
    description: 'Began wholesale trade exports to beauty clinics and dermatological centers in South Asia and Europe.'
  }
];

export const About = () => {
  return (
    <>
      <SEO
        title="Our Skincare Legacy"
        description="Learn about the history of Cosmalac. Established in 2016, we formulate premium medical-grade skincare solutions backed by clinical R&D and clean manufacturing."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-body">
        {/* ================= 1. PREMIUM ABOUT HERO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold">Est. 2016</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary font-heading leading-tight">
              Pioneering Scientific <br />
              <span className="text-rose-gold italic">Cosmetics</span>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Cosmalac was founded with a singular, scientific objective: to construct formulations that treat pigmentary disorders and aging signs at the cellular level, without stripping or compromising the delicate skin barrier.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Today, our laboratory serves dermatologists, high-end wellness clinics, and retail partners globally, reinforcing trust through peer-reviewed ingredients and transparent manufacturing.
            </p>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-border-pink shadow bg-bg-secondary flex items-center justify-center">
            <img
              src="/images/scientific_skincare_lab.png"
              alt="Cosmalac Advanced R&D Lab"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ================= 2. CORE PILLARS (MISSION / VISION) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-border-pink p-6 rounded-2xl space-y-4">
            <Target className="text-rose-gold" size={28} />
            <h3 className="text-lg font-bold text-text-primary font-heading">Our Mission</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              To formulate premium, dermatologist-approved skincare solutions that restore confidence, blending scientific accuracy with luxury cosmetic textures.
            </p>
          </div>

          <div className="bg-white border border-border-pink p-6 rounded-2xl space-y-4">
            <Compass className="text-rose-gold" size={28} />
            <h3 className="text-lg font-bold text-text-primary font-heading">Our Vision</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              To become a global benchmark for clean, scientific skin brightening, proving that high-end beauty and clinical safety can coexist seamlessly.
            </p>
          </div>

          <div className="bg-white border border-border-pink p-6 rounded-2xl space-y-4">
            <ShieldCheck className="text-rose-gold" size={28} />
            <h3 className="text-lg font-bold text-text-primary font-heading">Our Values</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Efficacy, safety, transparency, and clinical excellence. We never use placeholders or marketing gimmicks; we rely on proven biological science.
            </p>
          </div>
        </section>

        {/* ================= 3. CHRONOLOGICAL TIMELINE ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold">Milestones</span>
            <h2 className="text-3xl font-bold text-text-primary font-heading">Our Chronological Journey</h2>
          </div>

          <div className="relative max-w-3xl mx-auto border-l-2 border-border-pink/80 pl-8 space-y-12">
            {TIMELINE_MILESTONES.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative space-y-2 text-left"
              >
                {/* Glowing Node */}
                <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 border-white bg-rose-gold flex items-center justify-center shadow-sm">
                  <Calendar size={10} className="text-white" />
                </div>
                
                <span className="text-xs font-bold text-rose-gold font-body">{milestone.year}</span>
                <h3 className="text-lg font-bold text-text-primary font-heading">{milestone.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-body">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= 4. FOUNDERS MESSAGE ================= */}
        <section className="bg-bg-secondary border border-border-pink rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body">Co-Founder's Commitment</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">"Skincare is a Science, Not a Shortcut"</h2>
            <p className="text-sm text-text-secondary italic leading-relaxed font-body">
              "We noticed that many whitening creams in the market achieved fast results using hazardous mercury or hydroquinone derivatives, leaving behind irreversible skin damage. At Cosmalac, we set out to prove that by combining stable active ingredients with nourishing botanical lipids, we can deliver beautiful whitening results safely and sustainably."
            </p>
            <h4 className="text-sm font-semibold text-text-primary font-body">— Anura Gunasekara, Co-Founder & Chief Chemist</h4>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center">
              <Heart size={44} className="text-rose-gold animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
