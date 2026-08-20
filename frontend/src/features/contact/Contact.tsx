import { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, Loader2, MessageSquare, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'General' as 'General' | 'Distributor',
    message: ''
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
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
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
    <>
      <SEO
        title="Contact & Brand Inquiries | Cosmalac"
        description="Connect with the Cosmalac team for product information, brand presentation, or partnership inquiries."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-body text-left bg-[#F1EFE7]">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
            Brand Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121110] font-heading">
            Connect With Us
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-medium">
            Reach our corporate desk to learn more about our formulations, brand story, or trade partnership opportunities.
          </p>
        </div>

        {/* Info Grid & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#D8D2C8] p-6 sm:p-8 rounded-3xl shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-[#121110] font-heading">
                Corporate Office
              </h3>

              <div className="space-y-4 text-xs text-[#57534E] font-medium">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-rose-gold mt-0.5 shrink-0" />
                  <p className="text-[#121110]">123 Beauty Street, Colombo, Sri Lanka</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-rose-gold shrink-0" />
                  <p className="text-[#121110]">+94 11 234 5678</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-rose-gold shrink-0" />
                  <p className="text-[#121110]">info@cosmalac.com</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-rose-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#121110]">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-[10px] text-[#57534E]">Timezone: GMT+5:30</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <h4 className="text-sm font-bold text-[#121110] uppercase tracking-wider">
                Authorized Showcase Guarantee
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                All showcased products represent authentic Cosmalac formulations crafted with premium cosmetic actives and strict quality controls.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 bg-white border border-[#D8D2C8] p-6 sm:p-8 rounded-3xl shadow-xs">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 space-y-4"
              >
                <CheckCircle2 size={44} className="text-rose-gold mx-auto" />
                <h3 className="text-xl font-bold font-heading text-[#121110]">
                  Message Transmitted
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed max-w-sm mx-auto font-medium">
                  Your inquiry message was received. A representative will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors shadow-2xs"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#121110]">
                    Send Brand Inquiry
                  </h3>
                  <p className="text-xs text-[#57534E] font-medium mt-0.5">
                    Leave your details below and our team will get back to you promptly.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
                    {error}
                  </div>
                )}

                {/* Form type Selector */}
                <div className="flex border border-[#D8D2C8] rounded-2xl overflow-hidden p-1 bg-[#F1EFE7]/50 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'General' })}
                    className={`flex-1 py-2 font-bold rounded-xl transition-colors ${
                      formData.type === 'General' ? 'bg-[#121110] text-white shadow-2xs' : 'text-[#57534E] hover:text-[#121110]'
                    }`}
                  >
                    General Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Distributor' })}
                    className={`flex-1 py-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-1 ${
                      formData.type === 'Distributor' ? 'bg-[#121110] text-white shadow-2xs' : 'text-[#57534E] hover:text-[#121110]'
                    }`}
                  >
                    <Award size={12} /> B2B Trade & Partnership
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                  />
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />
                  </div>
                </div>

                {/* Company (conditional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Company / Clinic Name {formData.type === 'Distributor' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    required={formData.type === 'Distributor'}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={formData.type === 'Distributor' ? 'e.g. Lotus Wellness Spa' : 'e.g. Individual'}
                    className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or question about Cosmalac..."
                    className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#121110] text-[#F1EFE7] text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-rose-gold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Submitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Send size={13} /> Send Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
