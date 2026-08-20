import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Check, Loader2, MessageSquare } from 'lucide-react';
import axiosInstance from '../../lib/axios';

export const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    siteName: 'Cosmalac',
    tagline: 'EST. 2016',
    contactEmail: 'info@cosmalac.com',
    contactPhone: '+94 11 234 5678',
    whatsAppNumber: '0779178371',
    address: '123 Beauty Street, Colombo, Sri Lanka',
    businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
    facebook: 'https://facebook.com/cosmalac',
    instagram: 'https://instagram.com/cosmalac',
    linkedin: 'https://linkedin.com/company/cosmalac'
  });

  // Query Settings
  const { isLoading } = useQuery({
    queryKey: ['admin-settings-data'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/settings');
      const data = res.data;
      if (data) {
        setForm({
          siteName: data.siteName || 'Cosmalac',
          tagline: data.tagline || 'EST. 2016',
          contactEmail: data.contactEmail || 'info@cosmalac.com',
          contactPhone: data.contactPhone || '+94 11 234 5678',
          whatsAppNumber: data.whatsAppNumber || '0779178371',
          address: data.address || '123 Beauty Street, Colombo, Sri Lanka',
          businessHours: data.businessHours || 'Mon - Fri: 9:00 AM - 5:00 PM',
          facebook: data.socialLinks?.facebook || '',
          instagram: data.socialLinks?.instagram || '',
          linkedin: data.socialLinks?.linkedin || ''
        });
      }
      return data;
    }
  });

  // Save Settings Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await axiosInstance.put('/cms/settings', payload);
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['admin-settings-data'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings-data'] });
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      siteName: form.siteName,
      tagline: form.tagline,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      whatsAppNumber: form.whatsAppNumber,
      address: form.address,
      businessHours: form.businessHours,
      socialLinks: {
        facebook: form.facebook,
        instagram: form.instagram,
        linkedin: form.linkedin
      }
    };
    updateMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 font-body text-left max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#121110]">
          System & Business Settings
        </h1>
        <p className="text-xs text-[#57534E] font-medium mt-1">
          Manage the dynamic WhatsApp number for lead routing, corporate contact channels, and social media presence.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#57534E] bg-white rounded-3xl border border-[#D8D2C8]">
          <Loader2 size={24} className="animate-spin text-rose-gold mx-auto mb-2" />
          Loading configurations...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#D8D2C8] rounded-3xl p-6 md:p-8 shadow-xs space-y-6 text-xs">
          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold shadow-xs">
              <Check size={16} /> Business settings and WhatsApp number updated successfully.
            </div>
          )}

          {/* Dynamic WhatsApp Integration Channel */}
          <div className="space-y-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
                Official WhatsApp Business Integration
              </h3>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
              Customer inquiries and distributor applications will open WhatsApp with pre-filled details addressed to this number. You can change this number anytime when handing over to the client.
            </p>

            <div>
              <label className="block font-bold uppercase tracking-wider text-emerald-950 mb-1">
                WhatsApp Destination Number *
              </label>
              <input
                type="text"
                required
                value={form.whatsAppNumber}
                onChange={(e) => setForm({ ...form, whatsAppNumber: e.target.value })}
                placeholder="e.g. 0779178371 or +94779178371"
                className="w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-[#121110] font-bold focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-[#57534E] block mt-1">
                Default: 0779178371 (Sri Lanka format or International with country code).
              </span>
            </div>
          </div>

          {/* Core Branding Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#121110] border-b border-[#D8D2C8] pb-2">
              Corporate Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Tagline / Heritage
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  General Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Direct Telephone
                </label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-bold focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Head Office / Salon Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Support Operating Hours
                </label>
                <input
                  type="text"
                  value={form.businessHours}
                  onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                />
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#121110] border-b border-[#D8D2C8] pb-2">
              Social Media Handles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-3.5 bg-[#121110] text-[#F1EFE7] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving Settings...
                </>
              ) : (
                <>
                  <Save size={14} /> Save Business Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsManager;
