import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on navigation change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Quality & R&D', path: '/quality' },
    { name: 'Science Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" class="flex flex-col group">
          <span class="text-2xl font-bold tracking-widest text-text-primary font-heading group-hover:text-rose-gold transition-colors duration-300">
            COSMALAC
          </span>
          <span class="text-[9px] tracking-[0.3em] uppercase text-text-secondary -mt-1 font-body">
            Est. 2016
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav class="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                class={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-rose-gold font-body relative py-1 ${
                  isActive ? 'text-rose-gold' : 'text-text-secondary'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    class="absolute bottom-0 left-0 right-0 h-[1.5px] bg-rose-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Admin Login */}
        <div class="hidden md:flex items-center space-x-4">
          <Link
            to="/admin"
            class="p-2 text-text-secondary hover:text-rose-gold transition-colors duration-300"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <User size={18} />
          </Link>
          
          <Link
            to="/contact"
            class="px-5 py-2.5 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2 group"
          >
            Inquire Now
            <ArrowRight size={13} class="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div class="md:hidden flex items-center gap-3">
          <Link
            to="/admin"
            class="p-2 text-text-secondary hover:text-rose-gold"
            aria-label="Admin Dashboard"
          >
            <User size={18} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            class="p-2 text-text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            class="md:hidden bg-bg-secondary/95 border-b border-border-pink backdrop-blur-md overflow-hidden"
          >
            <div class="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    class={`block px-3 py-2 rounded-lg text-base font-medium tracking-wide transition-colors ${
                      isActive
                        ? 'bg-brand-primary/20 text-rose-gold'
                        : 'text-text-secondary hover:bg-brand-primary/10 hover:text-text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div class="pt-4 border-t border-border-pink">
                <Link
                  to="/contact"
                  class="w-full text-center block py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors duration-300"
                >
                  Inquire Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
