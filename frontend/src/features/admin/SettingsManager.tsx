import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Check, Loader2 } from 'lucide-react';
import axiosInstance from '../../lib/axios';

const MOCK_SETTINGS = {
  siteName: 'Cosmalac',
  tagline: 'EST. 2016',
  contactEmail: 'info@cosmalac.com',
  contactPhone: '+94 11 234 5678',
  address: '123 Beauty Street, Colombo, Sri Lanka',
  businessHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
  socialLinks: {
    facebook: 'https://facebook.com/cosmalac',
    instagram: 'https://instagram.com/cosmalac',
    linkedin: 'https://linkedin.com/company/cosmalac'
  }
};

export const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    siteName: '',
    tagline: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    businessHours: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });

  // Query Settings
  const { isLoading } = useQuery({
    queryKey: ['admin-settings-data'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/settings');
      const data = res.data;
      setForm({
        siteName: data.siteName || '',
        tagline: data.tagline || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        address: data.address || '',
        businessHours: data.businessHours || '',
        facebook: data.socialLinks?.facebook || '',
        instagram: data.socialLinks?.instagram || '',
        linkedin: data.socialLinks?.linkedin || ''
      });
      return data;
    },
    retry: false,
    initialData: MOCK_SETTINGS
  });

  // Save Settings Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await axiosInstance.put('/cms/settings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings-data'] });
      setSuccess(true);
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
    <div class="space-y-6 font-body text-left max-w-2xl">
      <div>
        <h1 class="text-2xl font-bold font-heading text-text-primary">CMS Settings</h1>
        <p class="text-xs text-text-secondary font-body">Manage global metadata, trade support emails, shipping addresses, and social handles.</p>
      </div>

      {isLoading ? (
        <div class="text-xs text-text-secondary">Loading configurations...</div>
      ) : (
        <form onSubmit={handleSubmit} class="bg-white border border-border-pink rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-xs">
          {success && (
            <div class="p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl flex items-center gap-2 font-semibold">
              <Check size={14} /> Site settings updated successfully.
            </div>
          )}

          {/* Core Metadata */}
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-pink/40 pb-2">
              Branding Metadata
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Brand Tagline</label>
                <input
                  type="text"
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-pink/40 pb-2">
              Communication channels
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Support Email</label>
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Support Phone</label>
                <input
                  type="text"
                  required
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">GMP Plant Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Business Hours</label>
                <input
                  type="text"
                  required
                  value={form.businessHours}
                  onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-pink/40 pb-2">
              Social networks links
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
              <div>
                <label class="block font-semibold uppercase tracking-wider text-text-secondary mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  class="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-border-pink/40">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              class="px-8 py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold disabled:bg-muted transition-colors flex items-center gap-2"
            >
              {updateMutation.isPending ? <Loader2 size={12} class="animate-spin" /> : <Save size={12} />}
              Save Site Config
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsManager;
