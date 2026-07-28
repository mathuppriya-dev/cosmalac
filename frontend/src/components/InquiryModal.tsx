import { useState } from 'react';
import { X, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../lib/axios';
import { FocusTrap } from './Accessibility';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductTitle?: string;
}

export const InquiryModal = ({ isOpen, onClose, defaultProductTitle }: InquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'General' as 'General' | 'Distributor',
    message: defaultProductTitle ? `I would like to inquire about the ${defaultProductTitle} product.` : ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post('/inquiries', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        type: 'General',
        message: ''
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        setError(`${msg}: ${errors.map((e: any) => e.message).join(', ')}`);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap isOpen={isOpen} onClose={onClose}>
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              class="fixed inset-0 bg-[#2D2D2D]/35 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              class="bg-white rounded-3xl border border-border-pink shadow-2xl p-6 md:p-8 max-w-lg w-full relative z-10 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                class="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {success ? (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  class="text-center py-8 space-y-4"
                >
                  <div class="flex justify-center">
                    <CheckCircle2 size={56} class="text-rose-gold animate-bounce" />
                  </div>
                  <h2 id="modal-title" class="text-2xl font-bold font-heading text-text-primary">
                    Thank You
                  </h2>
                  <p class="text-sm text-text-secondary leading-relaxed font-body max-w-sm mx-auto">
                    Your inquiry has been successfully sent. Our trade and customer care representatives will follow up shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      onClose();
                    }}
                    class="mt-6 px-6 py-2.5 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors duration-300"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                /* Form Screen */
                <div>
                  <h2 id="modal-title" class="text-2xl font-bold font-heading text-text-primary mb-1">
                    Send Inquiry
                  </h2>
                  <p class="text-xs text-text-secondary font-body mb-6">
                    Connect with our skincare consultants or request distributor details.
                  </p>

                  <form onSubmit={handleSubmit} class="space-y-4 font-body">
                    {/* Error Banner */}
                    {error && (
                      <div class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs leading-relaxed">
                        {error}
                      </div>
                    )}

                    {/* Name input */}
                    <div>
                      <label class="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        class="w-full px-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/30"
                      />
                    </div>

                    {/* Contact Info (Row) */}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          class="w-full px-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/30"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          class="w-full px-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/30"
                        />
                      </div>
                    </div>

                    {/* B2B / Clinic Name */}
                    <div>
                      <label class="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                        Company / Clinic Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Optional for wholesale inquiries"
                        class="w-full px-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/30"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label class="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        class="w-full px-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-white"
                      >
                        <option value="General">General Skincare Inquiry (B2C)</option>
                        <option value="Distributor">Wholesale / Distributor Partnership (B2B)</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label class="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        class="w-full px-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/30 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      class="w-full mt-2 py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold disabled:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} class="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={12} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
};
export default InquiryModal;
