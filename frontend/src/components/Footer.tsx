import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, ArrowRight, Heart } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#EBE7DC]/70 border-t border-[#D8D2C8] pt-16 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold tracking-widest text-[#121110] font-logo">
                COSMALAC
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#6E6E6E] -mt-1 font-body font-semibold">
                Est. 2016
              </span>
            </Link>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium max-w-xs">
              Scientific solutions formulated for exceptional skin whitening, blemish care, and natural anti-aging therapy.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://facebook.com/cosmalac" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full border border-[#D8D2C8] text-[#57534E] hover:text-rose-gold transition-colors duration-300 shadow-2xs">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com/cosmalac" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full border border-[#D8D2C8] text-[#57534E] hover:text-rose-gold transition-colors duration-300 shadow-2xs">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com/company/cosmalac" target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full border border-[#D8D2C8] text-[#57534E] hover:text-rose-gold transition-colors duration-300 shadow-2xs">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#121110] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/products" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  All Formulations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/b2b" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  B2B Trade & Wholesale
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  FAQs & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#121110] mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/contact" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#57534E] hover:text-rose-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#121110] mb-4">
              Stay Connected
            </h3>
            <p className="text-xs text-[#57534E] mb-4 leading-relaxed font-medium">
              Subscribe to receive updates on new products, skincare tips, and brand releases.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                Thank you for subscribing to Cosmalac.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D8D2C8] rounded-full text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold pr-10 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 p-2 bg-[#121110] text-white rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center shadow-xs"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#D8D2C8]/60 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#57534E] font-medium flex items-center gap-1">
            © {new Date().getFullYear()} COSMALAC. All rights reserved. Crafted with{' '}
            <Heart size={11} className="text-rose-gold fill-rose-gold" /> for skincare perfection.
          </p>

          <p className="text-xs text-[#57534E] font-medium">
            Luxury Skincare Heritage Est. 2016
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
