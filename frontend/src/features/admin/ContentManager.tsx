import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Compass,
  Target,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ExternalLink
} from 'lucide-react';
import axiosInstance from '../../lib/axios';

const DEFAULT_CONTENT = {
  vision: {
    en: 'To become a global benchmark for clean, scientific skin brightening, proving that high-end beauty and clinical safety can coexist seamlessly.'
  },
  mission: {
    en: 'To formulate luxurious, skin-friendly beauty solutions that restore natural confidence, combining enriching botanical care with targeted cosmetic performance.'
  },
  values: [
    {
      id: 'val_1',
      title: { en: 'Since 2016' },
      description: { en: 'Over 9 Years of Skincare Trust' }
    },
    {
      id: 'val_2',
      title: { en: 'Targeted Radiance' },
      description: { en: 'Visible Clarity & Tone Balance' }
    },
    {
      id: 'val_3',
      title: { en: 'Barrier Comfort' },
      description: { en: 'Rich Botanical Night Lipids' }
    },
    {
      id: 'val_4',
      title: { en: 'B2B Verified' },
      description: { en: 'Wholesale Distributor Network' }
    }
  ],
  hero: {
    badge: { en: 'EST. 2016' },
    title: { en: 'Reveal Your Natural' },
    highlight: { en: 'Radiance' },
    description: {
      en: 'Formulated with luxury botanicals and proven cosmetic actives for visible clarity and effortless skin harmony.'
    },
    ctaPrimary: { en: 'Explore Formulations' },
    ctaSecondary: { en: 'B2B Trade Inquiries' }
  },
  sections: [
    { id: 'hero', name: 'Hero Showcase', visible: true, order: 1 },
    { id: 'philosophy', name: 'Brand Philosophy', visible: true, order: 2 },
    { id: 'catalog', name: 'Featured Formulations', visible: true, order: 3 },
    { id: 'values', name: 'Brand Values & Commitment', visible: true, order: 4 },
    { id: 'b2b', name: 'B2B Trade & Wholesale', visible: true, order: 5 },
    { id: 'contact', name: 'Contact & Inquiries', visible: true, order: 6 }
  ]
};

export const ContentManager = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [previewTab, setPreviewTab] = useState<'hero' | 'vision' | 'pillars' | 'sections'>('hero');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form State initialized with rich default values
  const [contentForm, setContentForm] = useState<any>(DEFAULT_CONTENT);

  // Fetch CMS Content
  const { isLoading } = useQuery({
    queryKey: ['admin-cms-content'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/content');
      const data = res.data;
      if (data) {
        setContentForm({
          vision: data.vision?.en ? data.vision : DEFAULT_CONTENT.vision,
          mission: data.mission?.en ? data.mission : DEFAULT_CONTENT.mission,
          values: data.values && data.values.length === 4 ? data.values : DEFAULT_CONTENT.values,
          hero: {
            badge: data.hero?.badge?.en ? data.hero.badge : DEFAULT_CONTENT.hero.badge,
            title: data.hero?.title?.en ? data.hero.title : DEFAULT_CONTENT.hero.title,
            highlight: data.hero?.highlight?.en ? data.hero.highlight : DEFAULT_CONTENT.hero.highlight,
            description: data.hero?.description?.en ? data.hero.description : DEFAULT_CONTENT.hero.description,
            ctaPrimary: data.hero?.ctaPrimary?.en ? data.hero.ctaPrimary : DEFAULT_CONTENT.hero.ctaPrimary,
            ctaSecondary: data.hero?.ctaSecondary?.en ? data.hero.ctaSecondary : DEFAULT_CONTENT.hero.ctaSecondary
          },
          sections: data.sections?.length ? data.sections : DEFAULT_CONTENT.sections
        });
      }
      return data;
    }
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await axiosInstance.put('/cms/content', payload);
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['admin-cms-content'] });
      queryClient.invalidateQueries({ queryKey: ['public-cms-content'] });
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(contentForm);
  };

  const toggleSectionVisibility = (id: string) => {
    const updated = contentForm.sections.map((sec: any) =>
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    setContentForm({ ...contentForm, sections: updated });
  };

  const handlePillarChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedValues = [...contentForm.values];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: { en: value }
    };
    setContentForm({ ...contentForm, values: updatedValues });
  };

  return (
    <div className="space-y-6 text-left font-body w-full max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D2C8] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#121110]">
            Brand Content & Homepage CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] font-medium mt-1">
            Edit content on the left and see the real-time live website preview on the right.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-white border border-[#D8D2C8] hover:border-rose-gold text-[#121110] text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs inline-flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={13} /> View Live Website
          </a>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="px-6 py-2.5 bg-[#121110] hover:bg-rose-gold text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : success ? (
              <>
                <Check size={14} className="text-emerald-400" /> Saved Live!
              </>
            ) : (
              <>
                <Save size={14} /> Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace: Left CMS Form + Right Live Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT SIDE: STRUCTURED CMS INPUT FORM ================= */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. HOMEPAGE HERO HEADLINE & COPY */}
            <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-rose-gold" size={18} />
                  <h3 className="text-base font-extrabold font-heading text-[#121110] uppercase tracking-wider">
                    Homepage Hero Headline & Copy
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTab('hero')}
                  className="text-[11px] font-bold text-rose-gold hover:underline uppercase tracking-wider"
                >
                  View in Preview →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                    Heritage Badge
                  </label>
                  <input
                    type="text"
                    value={contentForm.hero.badge.en}
                    onFocus={() => {
                      setFocusedField('badge');
                      setPreviewTab('hero');
                    }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: {
                          ...contentForm.hero,
                          badge: { en: e.target.value }
                        }
                      })
                    }
                    placeholder="e.g. EST. 2016"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-bold focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                    Headline Highlight Word (Italic Rose Gold)
                  </label>
                  <input
                    type="text"
                    value={contentForm.hero.highlight.en}
                    onFocus={() => {
                      setFocusedField('highlight');
                      setPreviewTab('hero');
                    }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: {
                          ...contentForm.hero,
                          highlight: { en: e.target.value }
                        }
                      })
                    }
                    placeholder="e.g. Radiance"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-bold focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                  Main Headline Lead
                </label>
                <input
                  type="text"
                  value={contentForm.hero.title.en}
                  onFocus={() => {
                    setFocusedField('title');
                    setPreviewTab('hero');
                  }}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      hero: {
                        ...contentForm.hero,
                        title: { en: e.target.value }
                      }
                    })
                  }
                  placeholder="e.g. Reveal Your Natural"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-bold focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={contentForm.hero.description.en}
                  onFocus={() => {
                    setFocusedField('description');
                    setPreviewTab('hero');
                  }}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      hero: {
                        ...contentForm.hero,
                        description: { en: e.target.value }
                      }
                    })
                  }
                  placeholder="Enter supporting paragraph..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-medium focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={contentForm.hero.ctaPrimary.en}
                    onFocus={() => {
                      setFocusedField('ctaPrimary');
                      setPreviewTab('hero');
                    }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: {
                          ...contentForm.hero,
                          ctaPrimary: { en: e.target.value }
                        }
                      })
                    }
                    placeholder="e.g. Explore Formulations"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-bold focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                    Secondary B2B Button Text
                  </label>
                  <input
                    type="text"
                    value={contentForm.hero.ctaSecondary.en}
                    onFocus={() => {
                      setFocusedField('ctaSecondary');
                      setPreviewTab('hero');
                    }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: {
                          ...contentForm.hero,
                          ctaSecondary: { en: e.target.value }
                        }
                      })
                    }
                    placeholder="e.g. B2B Trade Inquiries"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-bold focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. COMPANY VISION & MISSION */}
            <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="flex items-center gap-2">
                  <Target className="text-rose-gold" size={18} />
                  <h3 className="text-base font-extrabold font-heading text-[#121110] uppercase tracking-wider">
                    Company Vision & Mission
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTab('vision')}
                  className="text-[11px] font-bold text-rose-gold hover:underline uppercase tracking-wider"
                >
                  View in Preview →
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                  Corporate Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={contentForm.vision.en}
                  onFocus={() => {
                    setFocusedField('vision');
                    setPreviewTab('vision');
                  }}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      vision: { en: e.target.value }
                    })
                  }
                  placeholder="Enter corporate vision statement..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-medium focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#121110] mb-1.5">
                  Corporate Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={contentForm.mission.en}
                  onFocus={() => {
                    setFocusedField('mission');
                    setPreviewTab('vision');
                  }}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      mission: { en: e.target.value }
                    })
                  }
                  placeholder="Enter corporate mission statement..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8D2C8] bg-[#F1EFE7]/40 text-[#121110] text-xs font-medium focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* 3. BRAND PILLARS & CORE VALUES */}
            <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-rose-gold" size={18} />
                  <h3 className="text-base font-extrabold font-heading text-[#121110] uppercase tracking-wider">
                    Brand Pillars & Core Values
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTab('pillars')}
                  className="text-[11px] font-bold text-rose-gold hover:underline uppercase tracking-wider"
                >
                  View in Preview →
                </button>
              </div>

              <div className="space-y-4">
                {contentForm.values.map((val: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F1EFE7]/40 border border-[#D8D2C8] rounded-2xl space-y-3"
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-gold block">
                      Pillar #{idx + 1}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#121110] mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={val.title.en}
                          onFocus={() => {
                            setFocusedField(`pillar_${idx}`);
                            setPreviewTab('pillars');
                          }}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Targeted Radiance"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#D8D2C8] bg-white text-[#121110] text-xs font-bold focus:outline-none focus:border-rose-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#121110] mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={val.description.en}
                          onFocus={() => {
                            setFocusedField(`pillar_${idx}`);
                            setPreviewTab('pillars');
                          }}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                          placeholder="e.g. Visible Clarity & Tone Balance"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#D8D2C8] bg-white text-[#121110] text-xs font-medium focus:outline-none focus:border-rose-gold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. HOMEPAGE SECTION VISIBILITY */}
            <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="text-rose-gold" size={18} />
                  <h3 className="text-base font-extrabold font-heading text-[#121110] uppercase tracking-wider">
                    Homepage Section Visibility
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTab('sections')}
                  className="text-[11px] font-bold text-rose-gold hover:underline uppercase tracking-wider"
                >
                  View in Preview →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contentForm.sections.map((sec: any) => (
                  <div
                    key={sec.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      sec.visible
                        ? 'bg-white border-[#D8D2C8]'
                        : 'bg-[#F1EFE7]/60 border-[#D8D2C8]/60 opacity-70'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#121110]">{sec.name}</h4>
                      <span className="text-[10px] text-[#78716C] font-semibold">
                        {sec.visible ? 'Currently Visible' : 'Hidden from Public'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(sec.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        sec.visible
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                      title={sec.visible ? 'Click to hide' : 'Click to show'}
                    >
                      {sec.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Action Bar */}
            <div className="flex items-center justify-end gap-4 pt-3">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-8 py-3.5 bg-[#121110] hover:bg-rose-gold text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center gap-2"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving...
                  </>
                ) : success ? (
                  <>
                    <Check size={15} className="text-emerald-400" /> Published Successfully!
                  </>
                ) : (
                  <>
                    <Save size={15} /> Save & Publish Live
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT SIDE: INTERACTIVE LIVE PREVIEW PANEL ================= */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white border border-[#D8D2C8] rounded-3xl p-5 shadow-sm space-y-4">
            {/* Preview Panel Header */}
            <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#121110]">
                  Live Website Preview
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#78716C] bg-[#F1EFE7] px-2.5 py-1 rounded-full border border-[#D8D2C8]">
                Real-Time
              </span>
            </div>

            {/* Preview Section Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#F1EFE7] rounded-xl text-[10px] font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setPreviewTab('hero')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewTab === 'hero'
                    ? 'bg-[#121110] text-white shadow-2xs'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Hero
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('vision')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewTab === 'vision'
                    ? 'bg-[#121110] text-white shadow-2xs'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Vision
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('pillars')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewTab === 'pillars'
                    ? 'bg-[#121110] text-white shadow-2xs'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Pillars
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('sections')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewTab === 'sections'
                    ? 'bg-[#121110] text-white shadow-2xs'
                    : 'text-[#57534E] hover:text-[#121110]'
                }`}
              >
                Sections
              </button>
            </div>

            {/* Interactive Live Screen Viewport */}
            <div className="bg-[#F6F3EC] border border-[#D8D2C8] rounded-2xl p-5 min-h-[360px] overflow-hidden relative shadow-inner flex flex-col justify-between">
              {/* TAB 1: HERO PREVIEW */}
              {previewTab === 'hero' && (
                <div className="space-y-4">
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border rounded-md text-[9px] font-bold uppercase tracking-wider text-[#D8A7B1] transition-all ${
                      focusedField === 'badge' ? 'ring-2 ring-rose-gold border-rose-gold bg-rose-gold/10' : 'border-[#D8D2C8]'
                    }`}
                  >
                    <Calendar size={10} /> {contentForm.hero.badge.en || 'EST. 2016'}
                  </div>

                  {/* Headline */}
                  <div
                    className={`p-1 rounded-lg transition-all ${
                      focusedField === 'title' || focusedField === 'highlight'
                        ? 'bg-rose-gold/10 ring-1 ring-rose-gold'
                        : ''
                    }`}
                  >
                    <h3 className="text-xl font-extrabold text-[#121110] font-heading leading-tight">
                      {contentForm.hero.title.en || 'Reveal Your Natural'} <br />
                      <span className="italic font-serif text-[#D8A7B1]">
                        {contentForm.hero.highlight.en || 'Radiance'}
                      </span>
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs text-[#57534E] leading-relaxed font-medium p-1 rounded-lg transition-all ${
                      focusedField === 'description' ? 'bg-rose-gold/10 ring-1 ring-rose-gold' : ''
                    }`}
                  >
                    {contentForm.hero.description.en ||
                      'Formulated with luxury botanicals and proven cosmetic actives.'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className={`px-3 py-1.5 bg-[#121110] text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-2xs ${
                        focusedField === 'ctaPrimary' ? 'ring-2 ring-rose-gold' : ''
                      }`}
                    >
                      {contentForm.hero.ctaPrimary.en || 'Explore Formulations'}
                      <ArrowRight size={10} />
                    </span>
                    <span
                      className={`px-3 py-1.5 bg-white border border-[#D8D2C8] text-[#121110] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs ${
                        focusedField === 'ctaSecondary' ? 'ring-2 ring-rose-gold border-rose-gold' : ''
                      }`}
                    >
                      {contentForm.hero.ctaSecondary.en || 'B2B Trade Inquiries'}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: VISION & MISSION PREVIEW */}
              {previewTab === 'vision' && (
                <div className="space-y-3">
                  <div
                    className={`p-3.5 bg-white border rounded-2xl space-y-1.5 transition-all ${
                      focusedField === 'vision' ? 'border-rose-gold ring-1 ring-rose-gold bg-rose-gold/5' : 'border-[#D8D2C8]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[#D8A7B1] text-xs font-bold uppercase">
                      <Target size={14} /> Corporate Vision
                    </div>
                    <p className="text-[11px] text-[#57534E] leading-relaxed font-medium">
                      {contentForm.vision.en}
                    </p>
                  </div>

                  <div
                    className={`p-3.5 bg-white border rounded-2xl space-y-1.5 transition-all ${
                      focusedField === 'mission' ? 'border-rose-gold ring-1 ring-rose-gold bg-rose-gold/5' : 'border-[#D8D2C8]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[#D8A7B1] text-xs font-bold uppercase">
                      <Compass size={14} /> Corporate Mission
                    </div>
                    <p className="text-[11px] text-[#57534E] leading-relaxed font-medium">
                      {contentForm.mission.en}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: PILLARS & VALUES PREVIEW */}
              {previewTab === 'pillars' && (
                <div className="grid grid-cols-2 gap-2">
                  {contentForm.values.map((val: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 bg-white border rounded-xl text-center space-y-1 transition-all ${
                        focusedField === `pillar_${idx}` ? 'border-rose-gold ring-1 ring-rose-gold bg-rose-gold/5' : 'border-[#D8D2C8]'
                      }`}
                    >
                      <Sparkles size={16} className="text-rose-gold mx-auto" />
                      <h5 className="text-[11px] font-bold text-[#121110] uppercase">
                        {val.title.en || `Pillar #${idx + 1}`}
                      </h5>
                      <p className="text-[9px] text-[#57534E] leading-tight font-medium">
                        {val.description.en}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SECTION VISIBILITY PREVIEW */}
              {previewTab === 'sections' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                    Homepage Live Status:
                  </span>
                  {contentForm.sections.map((sec: any) => (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between px-3 py-2 bg-white border border-[#D8D2C8] rounded-xl text-xs"
                    >
                      <span className="font-bold text-[#121110]">{sec.name}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          sec.visible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {sec.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Notice for Non-Technical Admins */}
              <div className="pt-4 border-t border-[#D8D2C8]/70 text-[10px] text-[#78716C] font-semibold flex items-center justify-between">
                <span>💡 Focusing any input on the left highlights it here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
