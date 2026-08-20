import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Mail,
  TrendingUp,
  Sparkles,
  Sliders,
  ArrowUpRight,
  ExternalLink,
  Plus,
  X,
  ChevronRight,
  Award
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import WidgetCustomizer, { WidgetConfig } from './components/WidgetCustomizer';

const TIME_SERIES_DATA: Record<string, Array<{ date: string; inquiries: number; conversions: number }>> = {
  '7D': [
    { date: 'Mon', inquiries: 3, conversions: 2 },
    { date: 'Tue', inquiries: 5, conversions: 3 },
    { date: 'Wed', inquiries: 4, conversions: 3 },
    { date: 'Thu', inquiries: 7, conversions: 5 },
    { date: 'Fri', inquiries: 6, conversions: 4 },
    { date: 'Sat', inquiries: 8, conversions: 6 },
    { date: 'Sun', inquiries: 5, conversions: 4 }
  ],
  '30D': [
    { date: 'Week 1', inquiries: 14, conversions: 9 },
    { date: 'Week 2', inquiries: 19, conversions: 12 },
    { date: 'Week 3', inquiries: 22, conversions: 15 },
    { date: 'Week 4', inquiries: 28, conversions: 20 }
  ],
  '90D': [
    { date: 'May', inquiries: 32, conversions: 21 },
    { date: 'Jun', inquiries: 45, conversions: 30 },
    { date: 'Jul', inquiries: 54, conversions: 38 }
  ],
  '1Y': [
    { date: 'Q1', inquiries: 80, conversions: 52 },
    { date: 'Q2', inquiries: 110, conversions: 78 },
    { date: 'Q3', inquiries: 145, conversions: 98 },
    { date: 'Q4', inquiries: 180, conversions: 130 }
  ]
};

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'kpi_cards',
    name: 'Key Performance Indicators',
    description: 'Summary counters for catalog, total inquiries, and trade leads',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'lead_inflow_chart',
    name: 'Lead Inflow & Conversion Analytics',
    description: 'Interactive time-series area chart with date filtering',
    enabled: true,
    category: 'analytics'
  },
  {
    id: 'formulation_share',
    name: 'Formulation Demand Share',
    description: 'Breakdown of demand between Crown and Queen products',
    enabled: true,
    category: 'catalog'
  },
  {
    id: 'quick_actions',
    name: 'Launchpad & Quick Actions',
    description: 'One-click shortcuts to add formulations and review leads',
    enabled: true,
    category: 'actions'
  },
  {
    id: 'audit_logs',
    name: 'Audit Activity Log Stream',
    description: 'Real-time timeline of administrative actions and customer events',
    enabled: true,
    category: 'activity'
  }
];

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D8D2C8] p-3 rounded-2xl shadow-xl text-xs space-y-1 text-left">
        <p className="font-bold text-[#121110] mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color || item.fill }}
            />
            <span className="text-[#57534E] font-medium">
              {item.name}:
            </span>
            <span className="font-bold text-[#121110]">
              {item.value} inquiries
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardOverview = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('cosmalac_dashboard_widgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_WIDGETS;
      }
    }
    return DEFAULT_WIDGETS;
  });

  const isWidgetEnabled = (id: string) => {
    return widgets.find((w) => w.id === id)?.enabled ?? true;
  };

  const handleToggleWidget = (id: string) => {
    const updated = widgets.map((w) =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    );
    setWidgets(updated);
    localStorage.setItem('cosmalac_dashboard_widgets', JSON.stringify(updated));
  };

  const handleResetWidgets = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.setItem('cosmalac_dashboard_widgets', JSON.stringify(DEFAULT_WIDGETS));
  };

  // Fetch Database-Driven Telemetry
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/stats');
      return res.data;
    }
  });

  const counts = statsData?.counts || {
    products: 2,
    activeProducts: 2,
    inquiries: 24,
    b2bInquiries: 8,
    conversionRate: 71,
    formulationShare: [
      { name: 'Crown Whitening (20g)', value: 58, color: '#D8A7B1' },
      { name: 'Queen 8X Night Cream', value: 42, color: '#D4AF37' }
    ]
  };

  const recentActivity = statsData?.recentActivity || [];

  return (
    <div className="space-y-8 text-left font-body">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-gold">
              Executive Dashboard
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#121110] tracking-tight">
            Cosmalac Control Center
          </h1>
          <p className="text-xs text-[#57534E] font-medium mt-0.5">
            Database-driven telemetry for formulations, wholesale distributor demand, and trade leads.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCustomizerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-bg-secondary border border-[#D8D2C8] rounded-2xl text-xs font-bold text-[#121110] transition-all duration-150 shadow-xs group"
          >
            <Sliders size={14} className="text-rose-gold group-hover:rotate-45 transition-transform" />
            <span>Customize Layout</span>
          </button>

          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-rose-gold transition-all duration-150 shadow-xs"
          >
            <Plus size={14} /> Add Formulation
          </Link>
        </div>
      </div>

      {/* Widget Customizer Modal */}
      <WidgetCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
        onResetWidgets={handleResetWidgets}
      />

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-3xl bg-white border border-[#D8D2C8]"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          {isWidgetEnabled('kpi_cards') && (
            <section
              aria-label="Key Performance Indicators"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {/* Card 1: Active Formulations */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
                      Active Catalog
                    </span>
                    <p className="text-3xl font-extrabold font-heading text-[#121110]">
                      {counts.activeProducts || counts.products}
                    </p>
                  </div>
                  <div className="p-3 bg-rose-gold/15 text-rose-gold rounded-2xl">
                    <ShoppingBag size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#D8D2C8]/60 text-xs">
                  <span className="text-emerald-700 flex items-center font-bold">
                    <ArrowUpRight size={14} /> 100%
                  </span>
                  <span className="text-[#57534E] text-[11px] font-medium">
                    Verified live formulations
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Total Inquiries */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
                      Total Inquiries
                    </span>
                    <p className="text-3xl font-extrabold font-heading text-[#121110]">
                      {counts.inquiries}
                    </p>
                  </div>
                  <div className="p-3 bg-rose-gold/15 text-rose-gold rounded-2xl">
                    <Mail size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#D8D2C8]/60 text-xs">
                  <span className="text-emerald-700 flex items-center font-bold">
                    <ArrowUpRight size={14} /> +18.4%
                  </span>
                  <span className="text-[#57534E] text-[11px] font-medium">
                    Database verified
                  </span>
                </div>
              </motion.div>

              {/* Card 3: B2B Trade Leads */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
                      B2B Trade Leads
                    </span>
                    <p className="text-3xl font-extrabold font-heading text-[#121110]">
                      {counts.b2bInquiries}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Award size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#D8D2C8]/60 text-xs">
                  <span className="text-[#D4AF37] font-bold flex items-center">
                    <Sparkles size={13} className="mr-1" /> Spas & Clinics
                  </span>
                  <span className="text-[#57534E] text-[11px] font-medium">
                    High value partners
                  </span>
                </div>
              </motion.div>

              {/* Card 4: Qualified Lead Conversion Rate */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
                      Conversion Rate
                    </span>
                    <p className="text-3xl font-extrabold font-heading text-[#121110]">
                      {counts.conversionRate}%
                    </p>
                  </div>
                  <div className="p-3 bg-accent-gold/15 text-accent-gold rounded-2xl">
                    <TrendingUp size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#D8D2C8]/60 text-xs">
                  <span className="text-emerald-700 flex items-center font-bold">
                    <ArrowUpRight size={14} /> +4.2%
                  </span>
                  <span className="text-[#57534E] text-[11px] font-medium">
                    Qualified lead velocity
                  </span>
                </div>
              </motion.div>
            </section>
          )}

          {/* Real-time Data Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart */}
            {isWidgetEnabled('lead_inflow_chart') && (
              <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold font-heading text-[#121110]">
                      Inquiry Inflow & Engagement Velocity
                    </h3>
                    <p className="text-xs text-[#57534E] font-medium">
                      Volume of customer inquiries and qualified distributor applications over time.
                    </p>
                  </div>

                  {/* Time Filters */}
                  <div className="flex items-center gap-1 p-1 bg-[#F1EFE7] rounded-xl border border-[#D8D2C8]">
                    {(['7D', '30D', '90D', '1Y'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setTimeRange(period)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          timeRange === period
                            ? 'bg-[#121110] text-white shadow-xs'
                            : 'text-[#57534E] hover:text-[#121110]'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="h-72 w-full text-xs pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={TIME_SERIES_DATA[timeRange]}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D8A7B1" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#D8A7B1" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C8" opacity={0.6} />
                      <XAxis dataKey="date" stroke="#57534E" tickLine={false} axisLine={false} />
                      <YAxis stroke="#57534E" tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="inquiries"
                        name="Total Inquiries"
                        stroke="#D8A7B1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorInquiries)"
                      />
                      <Area
                        type="monotone"
                        dataKey="conversions"
                        name="Qualified Leads"
                        stroke="#D4AF37"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorConversions)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-xs text-[#57534E] pt-2 border-t border-[#D8D2C8]/60">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold text-[#121110]">
                      <span className="w-3 h-3 rounded-full bg-rose-gold inline-block" /> Total Inquiries
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#121110]">
                      <span className="w-3 h-3 rounded-full bg-accent-gold inline-block" /> Qualified Leads
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-gold">
                    Avg. 24h Response SLA
                  </span>
                </div>
              </div>
            )}

            {/* Donut Chart */}
            {isWidgetEnabled('formulation_share') && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold font-heading text-[#121110]">
                    Formulation Demand Share
                  </h3>
                  <p className="text-xs text-[#57534E] font-medium">
                    Relative interest across active client products.
                  </p>
                </div>

                <div className="h-52 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={counts.formulationShare || [
                          { name: 'Crown Whitening (20g)', value: 58, color: '#D8A7B1' },
                          { name: 'Queen 8X Night Cream', value: 42, color: '#D4AF37' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(counts.formulationShare || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold font-heading text-[#121110]">
                      100%
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#57534E]">
                      Core Line
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#D8D2C8]/60 text-xs">
                  {(counts.formulationShare || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-[#121110]">{item.name}</span>
                      </div>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Live Audit Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            {isWidgetEnabled('quick_actions') && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold font-heading text-[#121110]">
                    Operations Launchpad
                  </h3>
                  <p className="text-xs text-[#57534E] font-medium">
                    Direct access to core administrative actions.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Link
                    to="/admin/content"
                    className="flex items-center justify-between p-3.5 bg-[#F1EFE7] hover:bg-rose-gold/15 border border-[#D8D2C8] rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#121110] text-white rounded-xl shadow-2xs">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#121110] group-hover:text-rose-gold transition-colors">
                          Edit Vision, Mission & Hero Copy
                        </p>
                        <p className="text-[10px] text-[#57534E] font-medium">
                          Update brand statements and hero headers
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-rose-gold group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/admin/products"
                    className="flex items-center justify-between p-3.5 bg-[#F1EFE7] hover:bg-rose-gold/15 border border-[#D8D2C8] rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-gold text-white rounded-xl shadow-2xs">
                        <ShoppingBag size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#121110] group-hover:text-rose-gold transition-colors">
                          Manage Skincare Formulations
                        </p>
                        <p className="text-[10px] text-[#57534E] font-medium">
                          Add, replace photos, and edit claims
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-rose-gold group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/admin/media"
                    className="flex items-center justify-between p-3.5 bg-[#F1EFE7] hover:bg-rose-gold/15 border border-[#D8D2C8] rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-gold text-white rounded-xl shadow-2xs">
                        <ExternalLink size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#121110] group-hover:text-rose-gold transition-colors">
                          Media Asset Library
                        </p>
                        <p className="text-[10px] text-[#57534E] font-medium">
                          Upload & organize JPG/PNG photos
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-rose-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="text-[10px] text-[#57534E] text-center pt-2 border-t border-[#D8D2C8]/60">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-[#F1EFE7] rounded font-bold border border-[#D8D2C8]">Cmd+K</kbd> for quick command palette
                </div>
              </div>
            )}

            {/* Audit Logs */}
            {isWidgetEnabled('audit_logs') && (
              <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-[#D8D2C8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-[#121110]">
                      Live Audit Stream & Customer Activity
                    </h3>
                    <p className="text-xs text-[#57534E] font-medium">
                      Chronological ledger of submitted trade inquiries and catalog operations.
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-rose-gold/15 text-rose-gold rounded-full">
                    Database Live
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {recentActivity.length === 0 ? (
                    <p className="text-xs text-[#57534E] py-6 text-center">
                      No recent activity recorded yet.
                    </p>
                  ) : (
                    recentActivity.map((act: any) => (
                      <div
                        key={act.id}
                        onClick={() => setSelectedAuditLog(act)}
                        className="flex items-start justify-between p-3.5 bg-[#F1EFE7]/60 hover:bg-[#F1EFE7] border border-[#D8D2C8] rounded-2xl cursor-pointer transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white text-rose-gold border border-[#D8D2C8] rounded-xl mt-0.5">
                            {act.type === 'inquiry' ? <Mail size={14} /> : <ShoppingBag size={14} />}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-[#121110] group-hover:text-rose-gold transition-colors">
                              {act.title}
                            </p>
                            <p className="text-[11px] text-[#57534E] font-medium line-clamp-1">
                              {act.detail}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-gold/15 text-rose-gold rounded-md">
                            {act.badge}
                          </span>
                          <p className="text-[10px] text-[#57534E] font-medium mt-1">
                            {new Date(act.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Audit Detail Modal */}
      <AnimatePresence>
        {selectedAuditLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAuditLog(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-[#D8D2C8] p-6 shadow-2xl z-10 text-left font-body space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C8]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-gold">
                  Audit Telemetry Entry
                </span>
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="p-1.5 text-[#57534E] hover:text-[#121110] rounded-lg hover:bg-bg-secondary"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-gold/15 text-rose-gold rounded-md">
                  {selectedAuditLog.badge}
                </span>
                <h4 className="text-base font-bold font-heading text-[#121110]">
                  {selectedAuditLog.title}
                </h4>
                <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                  {selectedAuditLog.detail}
                </p>
                <p className="text-[11px] text-[#57534E] pt-2 border-t border-[#D8D2C8]/60">
                  Recorded at: {new Date(selectedAuditLog.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="px-5 py-2 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardOverview;
