import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  ShoppingBag,
  Mail,
  Settings,
  Moon,
  Sun,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Command,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export const CommandPalette = ({
  isOpen,
  onClose,
  onToggleTheme,
  isDarkMode
}: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items
  const commands = [
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Go to Dashboard',
      subtitle: 'Overview KPIs, charts & trade leads',
      icon: ShoppingBag,
      action: () => {
        navigate('/admin');
        onClose();
      }
    },
    {
      id: 'nav-products',
      category: 'Navigation',
      title: 'Manage Formulations',
      subtitle: 'Edit products, sizes, and ingredients',
      icon: Sparkles,
      action: () => {
        navigate('/admin/products');
        onClose();
      }
    },
    {
      id: 'nav-inquiries',
      category: 'Navigation',
      title: 'Distributor Inquiries',
      subtitle: 'Review B2B trade applications & leads',
      icon: Mail,
      action: () => {
        navigate('/admin/inquiries');
        onClose();
      }
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      title: 'System & SEO Settings',
      subtitle: 'Configure store meta and notifications',
      icon: Settings,
      action: () => {
        navigate('/admin/settings');
        onClose();
      }
    },
    {
      id: 'action-theme',
      category: 'Quick Actions',
      title: isDarkMode ? 'Switch to Warm Luxury Light Mode' : 'Switch to Obsidian Dark Mode',
      subtitle: 'Toggle dashboard color theme preference',
      icon: isDarkMode ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      }
    },
    {
      id: 'action-public',
      category: 'Quick Actions',
      title: 'View Public Skincare Website',
      subtitle: 'Open storefront in new tab',
      icon: ExternalLink,
      action: () => {
        window.open('/', '_blank');
        onClose();
      }
    },
    {
      id: 'action-crown',
      category: 'Formulation Quick Link',
      title: 'Crown Whitening Beauty Cream',
      subtitle: '20g | 0.7 oz • 6-in-1 Active Whitening',
      icon: Sparkles,
      action: () => {
        navigate('/admin/products');
        onClose();
      }
    },
    {
      id: 'action-queen',
      category: 'Formulation Quick Link',
      title: 'Queen Beauty Cream 8X Night Cream',
      subtitle: 'Nano-Liposome & Snow Lotus Extract',
      icon: Sparkles,
      action: () => {
        navigate('/admin/products');
        onClose();
      }
    }
  ];

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-2xl border border-border-pink/60 dark:border-rose-gold/20 rounded-3xl shadow-2xl overflow-hidden z-10 text-left font-body"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-pink/40 dark:border-rose-gold/10">
              <Search className="text-rose-gold shrink-0" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, formulation, or action... (e.g. products, dark mode)"
                className="w-full bg-transparent text-sm text-text-primary dark:text-stone-100 placeholder:text-text-secondary/60 dark:placeholder:text-stone-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-text-secondary hover:text-text-primary dark:text-stone-400 rounded-md transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-bg-secondary dark:bg-stone-800 text-text-secondary dark:text-stone-300 rounded-lg">
                <kbd>ESC</kbd> to close
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[360px] overflow-y-auto p-3 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-text-secondary dark:text-stone-400">
                  No matching commands or formulations found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-150 text-left group ${
                        isSelected
                          ? 'bg-rose-gold/15 dark:bg-rose-gold/20 text-text-primary dark:text-stone-100 shadow-xs'
                          : 'hover:bg-bg-secondary/50 dark:hover:bg-stone-800/50 text-text-secondary dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl transition-colors ${
                            isSelected
                              ? 'bg-rose-gold text-white shadow-xs'
                              : 'bg-bg-secondary dark:bg-stone-800 text-rose-gold group-hover:bg-rose-gold group-hover:text-white'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-text-primary dark:text-stone-100">
                              {cmd.title}
                            </span>
                            <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-bg-secondary/80 dark:bg-stone-800 text-text-secondary dark:text-stone-400">
                              {cmd.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary dark:text-stone-400 line-clamp-1 mt-0.5">
                            {cmd.subtitle}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        size={14}
                        className={`text-rose-gold transition-transform duration-150 ${
                          isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Quick Shortcuts */}
            <div className="flex items-center justify-between px-5 py-3 bg-bg-secondary/40 dark:bg-stone-900/50 border-t border-border-pink/30 dark:border-rose-gold/10 text-[10px] text-text-secondary dark:text-stone-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-border-pink/50 dark:border-stone-700 font-bold">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-border-pink/50 dark:border-stone-700 font-bold">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-border-pink/50 dark:border-stone-700 font-bold">↵</kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center gap-1 text-rose-gold font-semibold">
                <Command size={10} /> Cosmalac Quick Actions
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
