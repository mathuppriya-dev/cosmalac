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
    <footer class="bg-bg-secondary border-t border-border-pink pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div class="space-y-4">
            <Link to="/" class="flex flex-col">
              <span class="text-2xl font-bold tracking-widest text-text-primary font-heading">
                COSMALAC
              </span>
              <span class="text-[9px] tracking-[0.3em] uppercase text-text-secondary -mt-1 font-body">
                Est. 2016
              </span>
            </Link>
            <p class="text-sm text-text-secondary leading-relaxed font-body max-w-xs">
              Scientific solutions formulated for exceptional skin whitening and natural anti-aging therapy.
            </p>
            <div class="flex space-x-3 pt-2">
              <a href="https://facebook.com" class="p-2 bg-white rounded-full border border-border-pink text-text-secondary hover:text-rose-gold hover:border-rose-gold transition-colors duration-300">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" class="p-2 bg-white rounded-full border border-border-pink text-text-secondary hover:text-rose-gold hover:border-rose-gold transition-colors duration-300">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com" class="p-2 bg-white rounded-full border border-border-pink text-text-secondary hover:text-rose-gold hover:border-rose-gold transition-colors duration-300">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-widest text-text-primary mb-4 font-body">
              Explore
            </h3>
            <ul class="space-y-2.5">
              <li>
                <Link to="/products" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Our Legacy
                </Link>
              </li>
              <li>
                <Link to="/quality" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Scientific R&D
                </Link>
              </li>
              <li>
                <Link to="/blog" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Skincare Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-widest text-text-primary mb-4 font-body">
              Information
            </h3>
            <ul class="space-y-2.5">
              <li>
                <Link to="/faq" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  FAQs & Support
                </Link>
              </li>
              <li>
                <Link to="/contact" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Distributor Portal
                </Link>
              </li>
              <li>
                <Link to="/privacy" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" class="text-sm text-text-secondary hover:text-rose-gold transition-colors font-body">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-widest text-text-primary mb-4 font-body">
              Stay Connected
            </h3>
            <p class="text-sm text-text-secondary mb-4 leading-relaxed font-body">
              Subscribe to receive updates on clinical trials, ingredients, and new releases.
            </p>
            {subscribed ? (
              <div class="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded text-xs text-text-secondary font-body">
                Thank you for subscribing to Cosmalac.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} class="relative">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full px-4 py-2.5 bg-white border border-border-pink rounded-full text-sm text-text-primary focus:outline-none focus:border-rose-gold pr-10 font-body placeholder:text-muted"
                />
                <button
                  type="submit"
                  class="absolute right-1 top-1 bottom-1 p-2 bg-text-primary text-bg-primary rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Localized Language Selector & Copyright */}
        <div class="border-t border-border-pink/60 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-xs text-text-secondary font-body flex items-center gap-1">
            © {new Date().getFullYear()} COSMALAC. All rights reserved. Crafted with{' '}
            <Heart size={10} class="text-rose-gold fill-rose-gold" /> for skincare perfection.
          </p>

          {/* Multilingual Selector (English, Sinhala, Tamil) */}
          <div class="flex items-center gap-2">
            <span class="text-[10px] uppercase tracking-wider text-text-secondary font-body">Language:</span>
            <div class="flex border border-border-pink rounded-full overflow-hidden bg-white text-xs">
              <button
                onClick={() => setLang('en')}
                class={`px-3 py-1 font-medium transition-colors ${
                  lang === 'en' ? 'bg-rose-gold text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('si')}
                class={`px-3 py-1 font-medium border-l border-r border-border-pink transition-colors ${
                  lang === 'si' ? 'bg-rose-gold text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                සිං
              </button>
              <button
                onClick={() => setLang('ta')}
                class={`px-3 py-1 font-medium transition-colors ${
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
