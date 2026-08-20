import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Check, RotateCcw, Eye, EyeOff, LayoutGrid } from 'lucide-react';

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'analytics' | 'catalog' | 'activity' | 'actions';
}

interface WidgetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
  onResetWidgets: () => void;
}

export const WidgetCustomizer = ({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
  onResetWidgets
}: WidgetCustomizerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Customize Dashboard Layout"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#1A1816] rounded-3xl border border-border-pink/80 dark:border-rose-gold/20 shadow-2xl p-6 sm:p-8 z-10 text-left font-body"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-pink/40 dark:border-rose-gold/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-gold/15 text-rose-gold rounded-2xl">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-text-primary dark:text-stone-100">
                    Customize Dashboard Widgets
                  </h3>
                  <p className="text-xs text-text-secondary dark:text-stone-400">
                    Personalize your view by toggling metrics and components.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-text-primary dark:text-stone-400 rounded-full hover:bg-bg-secondary dark:hover:bg-stone-800 transition-colors"
                aria-label="Close customizer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Widgets List */}
            <div className="py-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  onClick={() => onToggleWidget(widget.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    widget.enabled
                      ? 'bg-rose-gold/5 dark:bg-rose-gold/10 border-rose-gold/40 dark:border-rose-gold/30'
                      : 'bg-bg-secondary/40 dark:bg-stone-800/40 border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary dark:text-stone-100">
                        {widget.name}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-bg-secondary dark:bg-stone-800 text-text-secondary dark:text-stone-400">
                        {widget.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary dark:text-stone-400">
                      {widget.description}
                    </p>
                  </div>

                  {/* Toggle Pill */}
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                      widget.enabled ? 'bg-rose-gold' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 rounded-full bg-white shadow-xs ${
                        widget.enabled ? 'ml-auto' : 'mr-auto'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border-pink/40 dark:border-rose-gold/10 text-xs">
              <button
                onClick={onResetWidgets}
                className="flex items-center gap-1.5 text-text-secondary dark:text-stone-400 hover:text-text-primary dark:hover:text-stone-100 font-semibold transition-colors"
              >
                <RotateCcw size={13} /> Reset Layout
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-text-primary dark:bg-stone-100 text-bg-primary dark:text-stone-900 font-bold uppercase tracking-wider text-[11px] rounded-full hover:bg-rose-gold dark:hover:bg-rose-gold dark:hover:text-white transition-colors shadow-xs"
              >
                Save & Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WidgetCustomizer;
