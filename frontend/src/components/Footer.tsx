import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram, Linkedin, ArrowRight, Heart } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [lang, setLang] = useState('en');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-bg-secondary border-t border-border-pink pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold tracking-widest text-text-primary font-heading">
                COSMALAC
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-text-secondary -mt-1 font-body">
                Est. 2016
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed font-body max-w-xs">
              Scientific solutions formulated for exceptional skin whitening and natural anti-aging therapy.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://facebook.com" className="p-2 bg-white rounded-full border border-border-pink text-text-secondary hover:text-rose-gold hover:border-rose-gold transition-colors duration-300">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" className="p-2 bg-white rounded-full border border-border-pink text-text-secondary hover:text-rose-gold hover:border-rose-gold transition-colors duration-300">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com" className="p-2 bg-white rounded-full border border-border-pink text-text-secondary hover:text-rose-gold hover:border-rose-gold transition-colors duration-300">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-primary mb-4 font-body">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Our Legacy
                </Link>
              </li>
              <li>
                <Link to="/quality" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Scientific R&D
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Skincare Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-primary mb-4 font-body">
              Information
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/faq" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  FAQs & Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Distributor Portal
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-primary mb-4 font-body">
              Stay Connected
            </h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed font-body">
              Subscribe to receive updates on clinical trials, ingredients, and new releases.
            </p>
            {subscribed ? (
              <div className="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded text-xs text-text-secondary font-body">
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
                  className="w-full px-4 py-2.5 bg-white border border-border-pink rounded-full text-sm text-text-primary focus:outline-none focus:border-rose-gold pr-10 font-body placeholder:text-muted"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 p-2 bg-text-primary text-bg-primary rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Localized Language Selector & Copyright */}
        <div className="border-t border-border-pink/60 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary font-body flex items-center gap-1">
            © {new Date().getFullYear()} COSMALAC. All rights reserved. Crafted with{' '}
            <Heart size={10} className="text-rose-gold fill-rose-gold" /> for skincare perfection.
          </p>

          {/* Multilingual Selector (English, Sinhala, Tamil) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-body">Language:</span>
            <div className="flex border border-border-pink rounded-full overflow-hidden bg-white text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 font-medium transition-colors ${
                  lang === 'en' ? 'bg-rose-gold text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('si')}
                className={`px-3 py-1 font-medium border-l border-r border-border-pink transition-colors ${
                  lang === 'si' ? 'bg-rose-gold text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                සිං
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-3 py-1 font-medium transition-colors ${
                  lang === 'ta' ? 'bg-rose-gold text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
