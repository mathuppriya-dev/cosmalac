import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { SEO } from '../components/SEO';

const CATEGORIES = ['All', 'General', 'Products', 'Formulations', 'Distributors'];

const MOCK_FAQS = [
  {
    question: 'Are Cosmalac products safe for sensitive and combination skin?',
    answer: 'Yes, all Cosmalac products are formulated without harsh bleaches, harmful steroids, or damaging alcohols. We combine active cosmetic concentrations with soothing botanical extracts to maintain epidermal comfort and barrier balance.',
    category: 'Products'
  },
  {
    question: 'What makes Crown Whitening Beauty Cream and Queen 8X Night Cream unique?',
    answer: 'Our formulations target dark spots, uneven tone, blemishes, and dullness through dual-action actives like Alpha Arbutin and Kojic Acid that inhibit excess melanin production while delivering restorative nightly hydration.',
    category: 'Formulations'
  },
  {
    question: 'How do beauty clinics and salons apply for wholesale distribution?',
    answer: 'Verified spas, salons, and retail cosmetic distributors can visit our B2B Trade portal or contact our dedicated WhatsApp trade desk to receive the complete showcase catalog and wholesale tier pricing.',
    category: 'Distributors'
  },
  {
    question: 'Are Cosmalac products cruelty-free?',
    answer: 'Yes. Cosmalac is committed to ethical beauty. We do not test our products or raw ingredients on animals, and we maintain strict clean-beauty standards.',
    category: 'General'
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
    const matchCat = selectedCat === 'All' || (faq.category || '').toLowerCase() === selectedCat.toLowerCase();
    const matchSearch = (faq.question || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (faq.answer || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQs) | Cosmalac"
        description="Find answers to common questions regarding Cosmalac skincare formulations, ingredients, routine usage, and wholesale partnerships."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-body text-left bg-[#F1EFE7]">
        {/* Header */}
        <div className="text-center space-y-3">
          <HelpCircle className="text-rose-gold mx-auto" size={36} />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121110] font-heading">
            Support Center & FAQs
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-lg mx-auto font-medium">
            Find answers to commonly asked questions regarding formulation ingredients, night cream application, and distributor partnerships.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57534E]" size={16} />
            <input
              type="text"
              placeholder="Search questions or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D8D2C8] rounded-2xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold shadow-2xs"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  setFaqOpenIdx(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCat === cat
                    ? 'bg-[#121110] text-white shadow-2xs'
                    : 'bg-white border border-[#D8D2C8] text-[#57534E] hover:text-[#121110]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-white border border-[#D8D2C8] rounded-2xl" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#57534E] font-medium">
            No FAQ articles match your search criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq: any, idx: number) => (
              <div key={idx} className="border border-[#D8D2C8] bg-white rounded-2xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#121110] hover:bg-[#EBE7DC]/40 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`text-rose-gold shrink-0 transition-transform duration-300 ${
                      faqOpenIdx === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    faqOpenIdx === idx ? 'max-h-60 border-t border-[#D8D2C8]/60' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs text-[#57534E] leading-relaxed bg-[#F1EFE7]/50 font-medium">
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
