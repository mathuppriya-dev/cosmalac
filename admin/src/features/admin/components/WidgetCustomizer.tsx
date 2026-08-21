import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, RotateCcw } from 'lucide-react';

export type WidgetConfig = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'analytics' | 'catalog' | 'activity' | 'actions';
};

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
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#D8D2C8] shadow-2xl p-6 sm:p-8 z-10 text-left font-body"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-gold/15 text-rose-gold rounded-2xl">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-[#121110]">
                    Customize Dashboard Widgets
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Personalize your view by toggling metrics and components.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#57534E] hover:text-[#121110] rounded-full hover:bg-[#F1EFE7] transition-colors"
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
                      ? 'bg-rose-gold/5 border-rose-gold/40'
                      : 'bg-[#F1EFE7]/40 border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#121110]">
                        {widget.name}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F1EFE7] text-[#57534E]">
                        {widget.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E]">
                      {widget.description}
                    </p>
                  </div>

                  {/* Toggle Pill */}
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                      widget.enabled ? 'bg-rose-gold' : 'bg-stone-300'
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
            <div className="flex items-center justify-between pt-4 border-t border-[#D8D2C8]/50 text-xs">
              <button
                onClick={onResetWidgets}
                className="flex items-center gap-1.5 text-[#57534E] hover:text-[#121110] font-semibold transition-colors"
              >
                <RotateCcw size={13} /> Reset Layout
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#121110] text-white font-bold uppercase tracking-wider text-[11px] rounded-full hover:bg-rose-gold transition-colors shadow-xs"
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
