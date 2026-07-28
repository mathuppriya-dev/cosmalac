import { Shield, Sparkles, CheckSquare, Beaker, FileText, BadgeAlert } from 'lucide-react';
import { SEO } from '../components/SEO';

const STANDARDS = [
  {
    title: 'ISO 22716 GMP Certified',
    description: 'Our laboratory adheres to strict European guidelines for Good Manufacturing Practices in cosmetics, ensuring sterile compounding, pure raw materials, and cleanroom air control.'
  },
  {
    title: 'Dermatologically Tested',
    description: 'Every skin brightening cream is patch-tested on human volunteers under dermatological oversight to verify non-comedogenic and hypo-allergenic properties.'
  },
  {
    title: 'Cruelty-Free Commitment',
    description: 'We hold a strict zero-tolerance policy against animal testing. All ingredient suppliers must provide certified statements verifying they do not perform animal testing.'
  }
];

export const Quality = () => {
  return (
    <>
      <SEO
        title="Scientific Quality & Safety Standards"
        description="Explore Cosmalac's ISO 22716 cleanroom manufacturing facilities, our clinical R&D protocols, and our safety patch testing methodologies."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-body">
        {/* ================= 1. QUALITY HERO ================= */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold">Scientific Integrity</span>
          <h1 className="text-4xl font-extrabold text-text-primary font-heading">Quality & Research</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            At Cosmalac, quality control is not an afterthought; it is integrated into every phase of research, sourcing, compounding, and packaging.
          </p>
        </div>

        {/* ================= 2. CERTIFICATION ROW ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">Sterile Manufacturing Cleanrooms</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We compile our skin whitening creams and anti-aging serums inside Class 10,000 positive-pressure cleanrooms. This filters out 99.9% of dust and microbiological particles, guaranteeing the purity of each batch.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              We employ gas chromatography and high-performance liquid chromatography (HPLC) to verify that raw material suppliers deliver active ingredients (like Alpha Arbutin) at exactly their declared chemical purity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-start gap-4">
              <Shield className="text-rose-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">ISO 22716</h4>
                <p className="text-[11px] text-text-secondary">Cosmetics Good Manufacturing Practices verified.</p>
              </div>
            </div>
            <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-start gap-4">
              <Sparkles className="text-rose-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">Cruelty Free</h4>
                <p className="text-[11px] text-text-secondary">Strict animal-friendly manufacturing verified.</p>
              </div>
            </div>
            <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-start gap-4">
              <Beaker className="text-rose-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">HPLC Sourced</h4>
                <p className="text-[11px] text-text-secondary">Chromatography audited raw inputs.</p>
              </div>
            </div>
            <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-start gap-4">
              <CheckSquare className="text-rose-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">pH Monitored</h4>
                <p className="text-[11px] text-text-secondary">Skin barrier compatibility verified.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. TESTING AUDIT WORKFLOW ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold">Auditing</span>
            <h2 className="text-3xl font-bold text-text-primary font-heading">Our Testing Framework</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STANDARDS.map((std, idx) => (
              <div key={idx} className="bg-white border border-border-pink p-6 rounded-2xl text-left space-y-3">
                <FileText className="text-rose-gold" size={22} />
                <h3 className="text-base font-bold text-text-primary font-heading">{std.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{std.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. BANNER ADVISORY ================= */}
        <section className="p-8 bg-red-50/50 border border-red-100 rounded-3xl flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto text-left">
          <BadgeAlert size={36} className="text-red-600 flex-shrink-0" />
          <div className="space-y-1.5 font-body">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">Consumer Safety Alert</h3>
            <p className="text-xs text-red-700 leading-relaxed">
              COSMALAC has zero tolerance for hazardous ingredients like hydroquinone, mercury, or corticosteroids. Our research lab formulates botanical brightening alternatives which provide pigment restoration through healthy, natural pathways.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Quality;
