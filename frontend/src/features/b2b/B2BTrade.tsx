import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  Award,
  ShieldCheck,
  Loader2,
  Package
} from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

export const B2BTrade = () => {
  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    country: 'Sri Lanka',
    businessType: 'Distributor' as any,
    interestedProducts: ['Crown Whitening Beauty Cream', 'Queen Beauty Cream 8X'],
    expectedVolume: 'Medium' as any,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Fetch Live WhatsApp Number and Settings
  const { data: settings } = useQuery({
    queryKey: ['public-settings-data'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/settings');
      return res.data;
    }
  });

  const rawWhatsApp = settings?.whatsAppNumber || '0779178371';
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');
  const formattedWhatsApp = cleanPhone.startsWith('0')
    ? `94${cleanPhone.substring(1)}`
    : cleanPhone.startsWith('94')
    ? cleanPhone
    : `94${cleanPhone}`;

  // Direct Inquiry Mutation
  const inquiryMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await axiosInstance.post('/inquiries', payload);
    },
    onSuccess: () => {
      setSubmitted(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      type: 'B2B Trade',
      status: 'New'
    };
    inquiryMutation.mutate(payload);
  };

  const handleApplyViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Cosmalac Team,\n\nI would like to submit a B2B Trade / Distributor Application.\n\n` +
      `• Company: ${form.company || 'Not Specified'}\n` +
      `• Contact Person: ${form.name || 'Not Specified'}\n` +
      `• Email: ${form.email || 'Not Specified'}\n` +
      `• Phone/WhatsApp: ${form.phone || 'Not Specified'}\n` +
      `• Country: ${form.country}\n` +
      `• Business Type: ${form.businessType}\n` +
      `• Expected Volume: ${form.expectedVolume}\n` +
      `• Notes: ${form.message || 'Requesting wholesale catalog & pricing tier'}`
    );
    window.open(`https://wa.me/${formattedWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <>
      <SEO
        title="B2B Trade & Wholesale Distribution"
        description="Partner with Cosmalac as an authorized distributor, spa, clinic, or beauty salon partner across regional and international markets."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-body text-left bg-[#F1EFE7]">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-[#D8D2C8] rounded-full shadow-2xs">
            <Award size={14} className="text-rose-gold" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#121110]">
              Authorized Distribution Portal
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#121110] leading-tight">
            B2B Trade & Wholesale Distribution
          </h1>

          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-medium">
            Partner with Cosmalac to bring luxury, skin-friendly brightening cosmetics to your clinics, spas, and retail stores.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-[#D8D2C8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center font-bold">
              <Package size={20} />
            </div>
            <h3 className="text-base font-bold font-heading text-[#121110]">
              Direct Factory Pricing
            </h3>
            <p className="text-xs text-[#57534E] font-medium leading-relaxed">
              Tiered wholesale rates with high profit margins for verified spas, wellness clinics, and regional cosmetic retailers.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#D8D2C8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold font-heading text-[#121110]">
              Consistent Batch Stability
            </h3>
            <p className="text-xs text-[#57534E] font-medium leading-relaxed">
              Every jar is formulated with fresh active ingredients, sterile tamper-evident packaging, and strict quality control.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#D8D2C8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center font-bold">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-bold font-heading text-[#121110]">
              Dedicated WhatsApp Trade Desk
            </h3>
            <p className="text-xs text-[#57534E] font-medium leading-relaxed">
              Direct access to our corporate team for order dispatch, promotional collateral, and rapid re-order logistics.
            </p>
          </div>
        </div>

        {/* Application Form & Split WhatsApp CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: WhatsApp Fast-Track */}
          <div className="lg:col-span-5 bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Direct WhatsApp Fast-Track
              </span>
              <h3 className="text-2xl font-bold font-heading text-[#121110]">
                Instant Trade Chat
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                Want to speak with a trade executive immediately? Click below to open WhatsApp with your wholesale inquiry pre-filled.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-900">
                Official Trade WhatsApp
              </span>
              <p className="text-lg font-bold text-emerald-950 font-mono">
                {rawWhatsApp}
              </p>
              <p className="text-[11px] text-emerald-800 font-medium">
                Active Mon - Fri, 9:00 AM - 5:00 PM (GMT+5:30)
              </p>
            </div>

            <button
              onClick={handleApplyViaWhatsApp}
              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Apply Directly via WhatsApp
            </button>
          </div>

          {/* Right Column: Formal Application Form */}
          <div className="lg:col-span-7 bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="text-xl font-bold font-heading text-[#121110]">
                Wholesale Application Form
              </h3>
              <p className="text-xs text-[#57534E] font-medium">
                Fill in your commercial details and our distribution team will respond within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">
                  Trade Application Submitted!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto font-medium">
                  Thank you for your interest in Cosmalac. A dedicated trade representative has received your request and will reach out shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Business / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Lotus Wellness Spa Chain"
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Anjali Gunaratne"
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. trade@lotusspa.com"
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Business Type
                    </label>
                    <select
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                    >
                      <option value="Distributor">Distributor / Wholesaler</option>
                      <option value="Retailer">Retail Cosmetics Store</option>
                      <option value="Beauty Clinic">Dermatology / Beauty Clinic</option>
                      <option value="Spa">Wellness Spa / Salon Chain</option>
                      <option value="E-commerce">E-Commerce Merchant</option>
                      <option value="Other">Other Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                      Expected Order Volume
                    </label>
                    <select
                      value={form.expectedVolume}
                      onChange={(e) => setForm({ ...form, expectedVolume: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                    >
                      <option value="Small">Small Tier (50 - 200 units)</option>
                      <option value="Medium">Medium Tier (200 - 1,000 units)</option>
                      <option value="Large">Large Volume (1,000+ units)</option>
                      <option value="Not Sure">Trial / Sample Order First</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Distribution Inquiry Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your sales territory, client demographics, or required product quantities..."
                    className="w-full px-4 py-2.5 bg-[#F1EFE7]/50 border border-[#D8D2C8] rounded-xl text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryMutation.isPending}
                  className="w-full py-3.5 px-6 bg-[#121110] text-[#F1EFE7] text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-rose-gold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {inquiryMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Transmitting Application...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Trade Application
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

export default B2BTrade;
