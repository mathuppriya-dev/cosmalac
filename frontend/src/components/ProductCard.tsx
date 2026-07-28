import { Link } from 'react-router-dom';
import { ArrowRight, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    category: string;
    images: string[];
    isFeatured?: boolean;
    isBestseller?: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { title, slug, shortDescription, category, images, isFeatured, isBestseller } = product;

  // Fallback image path
  const imageUrl = images && images.length > 0 ? images[0] : '/images/product-placeholder.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-border-pink/70 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Product Image Section */}
      <div className="relative overflow-hidden bg-bg-secondary aspect-square flex items-center justify-center p-6">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isBestseller && (
            <span className="px-2.5 py-1 bg-rose-gold text-white text-[10px] font-semibold tracking-wider uppercase rounded-full flex items-center gap-1 shadow-sm font-body">
              <Award size={10} /> Bestseller
            </span>
          )}
          {isFeatured && (
            <span className="px-2.5 py-1 bg-accent-gold text-white text-[10px] font-semibold tracking-wider uppercase rounded-full flex items-center gap-1 shadow-sm font-body">
              <Star size={10} className="fill-white" /> Featured
            </span>
          )}
        </div>

        {/* Category Label overlay */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-white/80 border border-border-pink/40 backdrop-blur-sm text-[10px] uppercase tracking-widest text-text-secondary rounded font-body font-medium">
          {category}
        </span>
      </div>

      {/* Product Details Section */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-text-primary mb-2 font-heading group-hover:text-rose-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed font-body mb-5 flex-grow line-clamp-3">
          {shortDescription}
        </p>

        {/* Call to Actions */}
        <div className="flex items-center justify-between border-t border-border-pink/40 pt-4 mt-auto">
          <Link
            to={`/products/${slug}`}
            className="text-xs font-semibold uppercase tracking-wider text-text-primary group-hover:text-rose-gold transition-colors flex items-center gap-1.5 font-body"
          >
            Explore Formulation
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
