import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    _id?: string;
    title: string;
    slug?: string;
    shortDescription: string;
    category: string;
    size?: string;
    images?: string[];
    isFeatured?: boolean;
    isBestseller?: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { title, slug, id, _id, shortDescription, category, size, images, isFeatured, isBestseller } = product;
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  // Glowing pink / rose-gold spotlight follower
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  };

  const targetIdentifier = slug || id || _id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Smart image mapping to guarantee distinct photography
  let imageUrl = '/images/crown_whitening_cream.jpg';
  if (images && images.length > 0 && images[0]) {
    imageUrl = images[0];
  } else {
    const t = title.toLowerCase();
    if (t.includes('queen') || t.includes('8x')) {
      imageUrl = '/images/queen_beauty_cream.jpg';
    } else if (t.includes('cleanser') || t.includes('wash')) {
      imageUrl = '/images/luxury_skincare_hero.png';
    } else if (t.includes('toner') || t.includes('mist')) {
      imageUrl = '/images/luxury_skincare_hero.png';
    } else {
      imageUrl = '/images/crown_whitening_cream.jpg';
    }
  }

  return (
    <Link
      to={`/products/${targetIdentifier}`}
      className="group block h-full select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative h-full bg-white rounded-2xl border border-[#D8D2C8] hover:border-[#D8A7B1] shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between text-left"
      >
        {/* Pink Spotlight Aura Follower */}
        {mousePos.isHovered && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10 opacity-100"
            style={{
              background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(216, 167, 177, 0.25), rgba(244, 182, 194, 0.06) 45%, transparent 80%)`
            }}
          />
        )}

        {/* Top Product Image Container */}
        <div className="relative overflow-hidden bg-[#F6F3EC] aspect-[4/3] flex items-center justify-center p-4 z-0">
          <div className="absolute w-32 h-32 rounded-full bg-rose-gold/10 blur-lg group-hover:scale-125 transition-all duration-500 pointer-events-none" />

          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-106 transition-transform duration-500 ease-out drop-shadow-sm z-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/crown_whitening_cream.jpg';
            }}
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-2">
            {isBestseller && (
              <span className="px-2 py-0.5 bg-[#D4AF37] text-stone-950 text-[9px] font-extrabold tracking-wider uppercase rounded-full flex items-center gap-1 shadow-2xs">
                <Award size={10} className="shrink-0" /> Bestseller
              </span>
            )}
            {isFeatured && (
              <span className="px-2 py-0.5 bg-[#D8A7B1] text-white text-[9px] font-extrabold tracking-wider uppercase rounded-full flex items-center gap-1 shadow-2xs">
                <Sparkles size={10} className="shrink-0" /> Signature
              </span>
            )}
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-2.5 right-2.5 z-2">
            <span className="px-2 py-0.5 bg-white/90 border border-[#D8D2C8] backdrop-blur-xs text-[9px] uppercase font-bold tracking-widest text-[#57534E] rounded-md shadow-2xs">
              {category}
            </span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3 z-1">
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-[#121110] font-heading group-hover:text-rose-gold transition-colors duration-200 line-clamp-1">
              {title}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#57534E] leading-relaxed font-medium line-clamp-2">
              {shortDescription}
            </p>
          </div>

          {/* Clean, Non-Awkward Action Bar */}
          <div className="border-t border-[#D8D2C8]/60 pt-3 mt-auto flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#121110] group-hover:text-rose-gold transition-colors">
              Explore Formulation
              <ArrowRight size={13} className="text-rose-gold group-hover:translate-x-1 transition-transform duration-200" />
            </span>

            {size && (
              <span className="text-[10px] font-bold text-[#78716C]">
                {size}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
