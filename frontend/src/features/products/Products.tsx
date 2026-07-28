import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Grid, AlertCircle } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import { SEO } from '../../components/SEO';

const CATEGORIES = ['All', 'Creams', 'Serums', 'Cleansers', 'Toners'];

// Mock catalog for offline support
const MOCK_CATALOG = [
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
  },
  {
    id: 'prod_2',
    title: 'Cosmalac Clarifying Cleanser',
    slug: 'cosmalac-clarifying-cleanser',
    shortDescription: 'Gentle, pH-balanced facial wash that melts away makeup, oil, and impurities without stripping vital moisture.',
    category: 'Cleansers',
    images: ['/images/scientific_cleanser.png'],
    isFeatured: false,
    isBestseller: false
  },
  {
    id: 'prod_3',
    title: 'Cosmalac Balancing Toner',
    slug: 'cosmalac-balancing-toner',
    shortDescription: 'Alcohol-free pore-refining toner with Niacinamide and rose extract to soothe and rebalance skin.',
    category: 'Toners',
    images: ['/images/balancing_toner.png'],
    isFeatured: false,
    isBestseller: true
  }
];

export const Products = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Query catalog data via React Query
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products-list', selectedCat, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCat !== 'All') params.append('category', selectedCat);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    },
    // Keep caching active, but fallback to local data if server call fails
    retry: false,
    initialData: MOCK_CATALOG
  });

  // Local filtering & sorting logic (handles server offline fallback cases nicely)
  const filteredProducts = products
    .filter((p: any) => {
      const matchCat = selectedCat === 'All' || p.category.toLowerCase() === selectedCat.toLowerCase();
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      // Newest first (default)
      return 1;
    });

  return (
    <>
      <SEO
        title="Our Skincare Formulations"
        description="Browse the complete Cosmalac medical skincare catalog. Brightening creams, hydrating serums, cleansers, and toners formulated for optimal efficacy."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold font-body">Professional Skincare</span>
          <h1 className="text-4xl font-extrabold text-text-primary font-heading">Our Formulations</h1>
          <p className="text-sm text-text-secondary leading-relaxed font-body">
            Each formulation is crafted in clinical laboratories using high-potency ingredients like Alpha Arbutin, Niacinamide, and Botanical complexes.
          </p>
        </div>

        {/* ================= CONTROLS ROW (Search, Filter, Sort) ================= */}
        <div className="bg-white border border-border-pink/60 rounded-3xl p-6 shadow-sm space-y-6 font-body">
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search formulations by name or active ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-primary/20 border border-border-pink/70 rounded-full text-sm focus:outline-none focus:border-rose-gold placeholder:text-muted"
              />
            </div>
            
            <div className="flex items-center gap-2 self-end">
              <SlidersHorizontal size={14} className="text-text-secondary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-bg-primary/20 border border-border-pink/70 px-4 py-2.5 rounded-full text-xs font-medium text-text-secondary focus:outline-none focus:border-rose-gold"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="name-asc">Sort: Name (A - Z)</option>
                <option value="name-desc">Sort: Name (Z - A)</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Grid size={13} className="text-text-secondary flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex-shrink-0 ${
                  selectedCat === cat
                    ? 'bg-rose-gold text-white shadow-sm'
                    : 'bg-bg-primary/40 border border-border-pink/30 text-text-secondary hover:text-text-primary hover:bg-brand-primary/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================= PRODUCT GRID LIST ================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-square border border-border-pink animate-pulse" />
            ))}
          </div>
        ) : isError && filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-border-pink rounded-3xl space-y-3 font-body max-w-md mx-auto">
            <AlertCircle className="text-rose-gold mx-auto" size={40} />
            <h3 className="text-lg font-bold text-text-primary">Error Connecting</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We encountered an issue retrieving the catalog from our cloud database.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center font-body">
            <p className="text-sm text-text-secondary">No formulations found matching your filter selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
