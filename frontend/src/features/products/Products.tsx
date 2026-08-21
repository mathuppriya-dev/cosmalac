import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Sparkles, ShieldCheck, Award, Heart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import { SEO } from '../../components/SEO';

export const Products = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Query live catalog data from Railway API
  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['products-list', selectedCat, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCat !== 'All') params.append('category', selectedCat);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    },
    retry: 2
  });

  // Local filtering & sorting logic
  const filteredProducts = products
    .filter((p: any) => {
      const matchCat = selectedCat === 'All' || p.category?.toLowerCase() === selectedCat.toLowerCase();
      const matchSearch = !searchQuery ||
                          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.ingredients && Array.isArray(p.ingredients) && p.ingredients.some((ing: string) => ing.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  return (
    <>
      <SEO
        title="Signature Formulations Showcase | COSMALAC"
        description="Explore the Cosmalac luxury formulation showcase. Featuring our signature Crown Whitening Beauty Cream and Queen Beauty Cream 8X Night Whitening Cream."
      />

      <div className="bg-[#F1EFE7] min-h-screen text-left font-body pb-24">
        {/* ================= 1. SHOWCASE HERO HEADER ================= */}
        <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D8D2C8]/70 bg-gradient-to-b from-[#F1EFE7] via-[#EBE7DC]/60 to-[#F1EFE7]">
          {/* Ambient Glow Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-gold/15 blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D8D2C8] rounded-full shadow-2xs text-xs font-bold uppercase tracking-widest text-[#D8A7B1]"
            >
              <Sparkles size={13} className="animate-spin-slow" /> Official Brand Showcase
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold text-[#121110] font-heading tracking-tight"
            >
              Our Signature Formulations
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl mx-auto font-medium"
            >
              Explore our laboratory-perfected cosmetic creations. Formulated with targeted brightening actives like Alpha Arbutin, Kojic Acid, and nourishing botanical extracts for visible radiance and barrier comfort.
            </motion.p>
          </div>
        </section>

        {/* ================= 2. CONTROLS & SEARCH BAR ================= */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-white border border-[#D8D2C8] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57534E]" size={16} />
              <input
                type="text"
                placeholder="Search formulations by name or active ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-2xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#57534E] hover:text-[#121110]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selection */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-2xl">
                <SlidersHorizontal size={14} className="text-[#57534E]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#121110] focus:outline-none cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="name-asc">Sort: Name (A - Z)</option>
                  <option value="name-desc">Sort: Name (Z - A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. PRODUCT SHOWCASE GRID ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-96 border border-[#D8D2C8] animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center bg-white border border-[#D8D2C8] rounded-3xl space-y-4 max-w-md mx-auto shadow-xs">
              <Sparkles className="text-rose-gold mx-auto" size={36} />
              <h3 className="text-lg font-bold text-[#121110]">Database Connection</h3>
              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                Unable to load product formulations. Please click reload to refresh.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-[#121110] text-white rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-rose-gold transition-colors"
              >
                <RefreshCw size={12} /> Reload Catalog
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white border border-[#D8D2C8] rounded-3xl p-10 max-w-xl mx-auto shadow-xs">
              <p className="text-sm font-bold text-[#121110]">No formulations matched your search.</p>
              <p className="text-xs text-[#57534E]">Try searching for "Crown", "Queen", "Alpha Arbutin", or "Kojic Acid".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCat('All');
                }}
                className="px-5 py-2 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id || product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ================= 4. FORMULATION STANDARDS BADGES ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-[#D8D2C8] rounded-3xl p-8 shadow-xs">
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#121110]">Sterile GMP Packaging</h4>
                <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                  Sealed in premium glass containers with brushed bronze lids for maximum active freshness.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#121110]">Dual-Action Whitening</h4>
                <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                  Inhibits melanin synthesis while supporting natural cellular collagen renewal overnight.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center shrink-0">
                <Heart size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#121110]">Clean Purity Guarantee</h4>
                <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                  Free from harsh synthetic bleaches, damaging alcohols, or harmful additives.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Products;
