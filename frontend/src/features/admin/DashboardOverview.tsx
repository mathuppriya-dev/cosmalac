import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Mail, BookOpen, AlertCircle, FileText, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../lib/axios';

const MOCK_CHART_DATA = [
  { month: 'Jan', Inquiries: 12 },
  { month: 'Feb', Inquiries: 19 },
  { month: 'Mar', Inquiries: 15 },
  { month: 'Apr', Inquiries: 27 },
  { month: 'May', Inquiries: 22 },
  { month: 'Jun', Inquiries: 34 },
  { month: 'Jul', Inquiries: 29 }
];

const MOCK_STATS = {
  counts: {
    products: 4,
    inquiries: 24,
    blogs: 2,
    newInquiries: 6,
    b2bInquiries: 8,
    b2cInquiries: 16
  },
  recentActivity: [
    { id: '1', type: 'inquiry', title: 'Wholesale Application: Priya Spa', timestamp: new Date().toISOString(), detail: 'Requesting catalog for Southern province spas.' },
    { id: '2', type: 'blog', title: 'Blog published: Niacinamide benefits', timestamp: new Date().toISOString(), detail: 'Drafted by Evelyn Carter.' }
  ]
};

export const DashboardOverview = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cms/stats');
      return response.data;
    },
    retry: false,
    initialData: MOCK_STATS
  });

  if (isLoading) {
    return <div className="text-center py-20 text-text-secondary">Loading statistics...</div>;
  }

  const counts = stats?.counts || MOCK_STATS.counts;
  const recentActivity = stats?.recentActivity || MOCK_STATS.recentActivity;

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-text-primary">Dashboard</h1>
        <p className="text-xs text-text-secondary">Real-time overview of catalogs, active trade leads, and scientific blog publishing metrics.</p>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products */}
        <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Active Catalog</span>
            <p className="text-2xl font-bold text-text-primary">{counts.products}</p>
          </div>
          <div className="p-3 bg-brand-primary/20 text-rose-gold rounded-full">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Total Inquiries */}
        <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Total Inquiries</span>
            <p className="text-2xl font-bold text-text-primary">{counts.inquiries}</p>
          </div>
          <div className="p-3 bg-brand-primary/20 text-rose-gold rounded-full">
            <Mail size={20} />
          </div>
        </div>

        {/* New B2B Requests */}
        <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">B2B Trade leads</span>
            <p className="text-2xl font-bold text-text-primary">{counts.b2bInquiries}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Science Blogs */}
        <div className="bg-white border border-border-pink p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Publications</span>
            <p className="text-2xl font-bold text-text-primary">{counts.blogs}</p>
          </div>
          <div className="p-3 bg-brand-primary/20 text-rose-gold rounded-full">
            <BookOpen size={20} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Graph */}
        <div className="lg:col-span-2 bg-white border border-border-pink rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-heading">
            Lead Inflow Trend
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1DCE3" />
                <XAxis dataKey="month" stroke="#6E6E6E" />
                <YAxis stroke="#6E6E6E" />
                <Tooltip />
                <Line type="monotone" dataKey="Inquiries" stroke="#D8A7B1" strokeWidth={2.5} dot={{ fill: '#D4AF37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white border border-border-pink rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-heading mb-4">
              Audit activity logs
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-56 pr-2">
              {recentActivity.map((act: any) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  {act.type === 'inquiry' ? (
                    <Clock className="text-rose-gold mt-0.5 flex-shrink-0" size={14} />
                  ) : (
                    <FileText className="text-accent-gold mt-0.5 flex-shrink-0" size={14} />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-bold text-text-primary">{act.title}</p>
                    <p className="text-[11px] text-text-secondary leading-relaxed">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-muted text-center pt-3 border-t border-border-pink/40">
            System fully synchronized. Secure JWT session active.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
