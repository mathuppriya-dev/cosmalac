import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { SEO } from '../components/SEO';

const CATEGORIES = ['All', 'General', 'Products', 'Shipping', 'Distributors'];

const MOCK_FAQS = [
  {
    question: 'Are Cosmalac products safe for sensitive skin?',
    answer: 'Yes, all Cosmalac products are formulated without parabens, synthetic fragrances, or harsh alcohol. We focus on gentle active concentrations combined with barrier-supporting ingredients (like Hyaluronic Acid) and undergo rigorous dermatological testing to minimize any risk of irritation.',
    category: 'Products'
  },
  {
    question: 'What makes the Glow Cream so effective for whitening and brightening?',
    answer: 'The Cosmalac Glow Cream utilizes a dual-action whitening mechanism. Alpha Arbutin (2%) actively blocks tyrosinase (the key enzyme in melanin synthesis), while Niacinamide (5%) inhibits the transfer of pigment into skin cells. This scientific combination provides visible results within 4 to 8 weeks.',
    category: 'Products'
  },
  {
    question: 'How can we apply to become an international Cosmalac distributor?',
    answer: 'Interested retail and distribution partners can fill out our detailed B2B Distributor Inquiry Form on the Contact page. Our executive trade team will review your application, company profile, and market presence, and respond within 2-3 business days with wholesale catalogs.',
    category: 'Distributors'
  },
  {
    question: 'Are your products cruelty-free?',
    answer: 'Absolutely. Cosmalac is committed to ethical skincare. We do not test our products or ingredients on animals, nor do we commission third-party testing. We hold international cruelty-free certifications.',
    category: 'General'
  },
  {
    question: 'How long does shipping take for trade orders?',
    answer: 'For domestic trade partners in Sri Lanka, bulk delivery is completed in 3-5 business days. International distribution orders are shipped via sea/air freight and take 10-21 days depending on port clearances.',
    category: 'Shipping'
  }
];

export const FAQ = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  // Fetch FAQs from API
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs-page-list'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cms/faqs');
      return response.data;
    },
    retry: false,
    initialData: MOCK_FAQS
  });

  const toggleFaq = (idx: number) => {
    setFaqOpenIdx(faqOpenIdx === idx ? null : idx);
  };

  const filteredFaqs = faqs.filter((faq: any) => {
    const matchCat = selectedCat === 'All' || faq.category.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQs)"
        description="Find answers to questions about Cosmalac products, whitening cream ingredients, international wholesale shipping, and clinic partnerships."
      />

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-body">
        {/* Header */}
        <div class="text-center space-y-3">
          <HelpCircle class="text-rose-gold mx-auto" size={40} />
          <h1 class="text-4xl font-extrabold text-text-primary font-heading">Support Center & FAQs</h1>
          <p class="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
            Find answers to commonly asked questions regarding formulation safety, ingredient science, wholesale contracts, and clinic distributorships.
          </p>
        </div>

        {/* Filters and Search */}
        <div class="space-y-4">
          {/* Search bar */}
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search support database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold placeholder:text-muted"
            />
          </div>

          {/* Category Filters */}
          <div class="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  setFaqOpenIdx(null);
                }}
                class={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCat === cat
                    ? 'bg-rose-gold text-white'
                    : 'bg-white border border-border-pink/60 text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        {isLoading ? (
          <div class="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} class="h-12 bg-white border border-border-pink rounded-xl" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div class="text-center py-12 text-sm text-text-secondary">
            No FAQ articles match your search criteria.
          </div>
        ) : (
          <div class="space-y-4 text-left">
            {filteredFaqs.map((faq: any, idx: number) => (
              <div key={idx} class="border border-border-pink bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  class="w-full px-5 py-4.5 flex items-center justify-between text-left font-medium text-sm text-text-primary hover:bg-bg-secondary/40 transition-colors"
                >
                  <span class="pr-4">{faq.question}</span>
                  <ChevronDown
                    size={16}
                    class={`text-text-secondary flex-shrink-0 transition-transform duration-300 ${
                      faqOpenIdx === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  class={`transition-all duration-300 overflow-hidden ${
                    faqOpenIdx === idx ? 'max-h-60 border-t border-border-pink' : 'max-h-0'
                  }`}
                >
                  <p class="p-5 text-xs text-text-secondary leading-relaxed bg-bg-primary/20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FAQ;
