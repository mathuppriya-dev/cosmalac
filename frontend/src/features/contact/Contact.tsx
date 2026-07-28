import { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, Loader2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

export const Contact = () => {
  // Inquiry form states
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
        title="Contact Us & Distributor Inquiry"
        description="Get in touch with Cosmalac trade representatives. Access wholesale catalogs, or submit clinic B2B partnerships applications."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-body">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-gold">Trade & Support</span>
          <h1 className="text-4xl font-extrabold text-text-primary font-heading">Connect With Us</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Reach our trade desk to request wholesale price lists, or consult our skincare advisors.
          </p>
        </div>

        {/* Info Grid & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Info Cards & Map */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white border border-border-pink p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-text-primary font-heading">Global Headquarters</h3>
              
              <div className="space-y-3.5 text-xs text-text-secondary">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-rose-gold mt-0.5 flex-shrink-0" />
                  <p>123 Beauty Street, Colombo, Sri Lanka</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-rose-gold flex-shrink-0" />
                  <p>+94 11 234 5678</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-rose-gold flex-shrink-0" />
                  <p>info@cosmalac.com</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-rose-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-[10px] text-muted">Timezone: UTC+5:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized vector map placeholder */}
            <div className="bg-bg-secondary border border-border-pink rounded-3xl p-6 aspect-video flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
              <MapPin size={28} className="text-rose-gold animate-bounce" />
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">COSMALAC GMP Facility</h4>
              <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed">
                Our compounding laboratories and wholesale loading decks sit close to Colombo Port, enabling rapid maritime and air logistics.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 bg-white border border-border-pink p-6 md:p-8 rounded-3xl shadow-sm text-left">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 space-y-4"
              >
                <CheckCircle2 size={48} className="text-rose-gold mx-auto animate-pulse" />
                <h3 className="text-xl font-bold font-heading text-text-primary">Submission Successful</h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Your inquiry message was received. An executive trade specialist will contact you by phone or email within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-2 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-text-primary font-heading">Submit Trade Inquiry</h3>
                <p className="text-xs text-text-secondary">
                  Complete the forms below. General inquiries represent retail customers; distributor inputs register for wholesale trade licenses.
                </p>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                    {error}
                  </div>
                )}

                {/* Form type Selector */}
                <div className="flex border border-border-pink rounded-full overflow-hidden p-1 bg-bg-primary/20 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'General' })}
                    className={`flex-1 py-2 font-semibold rounded-full transition-colors ${
                      formData.type === 'General' ? 'bg-rose-gold text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    B2C Customer Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Distributor' })}
                    className={`flex-1 py-2 font-semibold rounded-full transition-colors flex items-center justify-center gap-1 ${
                      formData.type === 'Distributor' ? 'bg-rose-gold text-white shadow-sm' : 'text-text-secondary hover:text-rose-gold'
                    }`}
                  >
                    <Award size={12} /> B2B Distributor Application
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-primary/20 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold"
                  />
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-primary/20 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-primary/20 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold"
                    />
                  </div>
                </div>

                {/* Company (conditional) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Company / Clinic Name {formData.type === 'Distributor' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    required={formData.type === 'Distributor'}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={formData.type === 'Distributor' ? 'e.g. MedSkin Clinics Ltd' : 'e.g. Personal'}
                    className="w-full px-4 py-2 bg-bg-primary/20 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    {formData.type === 'Distributor' ? 'Proposed Territory & Message *' : 'Inquiry Message *'}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={formData.type === 'Distributor' ? 'Please describe your distribution territories, clinic count, and bulk volumes requested...' : 'Describe your concerns...'}
                    className="w-full px-4 py-2 bg-bg-primary/20 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send size={12} /> Send Application
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
