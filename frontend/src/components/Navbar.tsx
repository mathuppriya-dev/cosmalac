import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('cosmalac_theme');

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Our Story', path: '/about' },
    { name: 'B2B Trade', path: '/b2b' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F1EFE7]/95 backdrop-blur-md py-3.5 shadow-sm border-b border-[#D8D2C8]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo - Pure Black */}
        <Link to="/" className="flex flex-col group text-left">
          <span className="text-2xl font-extrabold tracking-[0.2em] font-logo text-[#121110] group-hover:text-rose-gold transition-colors duration-300">
            COSMALAC
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-[#57534E] -mt-1">
            EST. 2016
          </span>
        </Link>

        {/* Desktop Navigation Links - Pure Crisp Black */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-200 relative py-1 hover:text-rose-gold ${
                  isActive ? 'text-rose-gold font-extrabold' : 'text-[#121110]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/b2b"
            className="px-6 py-2.5 bg-[#121110] hover:bg-rose-gold text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm flex items-center gap-2 group"
          >
            Inquire Now
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#121110] focus:outline-none"
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
            className="md:hidden bg-white/95 border-b border-[#D8D2C8] backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2 text-left">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-rose-gold/15 text-rose-gold'
                        : 'text-[#121110] hover:bg-bg-secondary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-[#D8D2C8]">
                <Link
                  to="/b2b"
                  className="w-full text-center block py-3 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors duration-300"
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
