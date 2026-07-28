import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, CheckCircle2, Clock, AlertCircle, X, ShieldAlert, Award, Loader2 } from 'lucide-react';
import axiosInstance from '../../lib/axios';

const MOCK_INQUIRIES = [
  {
    id: 'inq_0',
    name: 'Priya Perera',
    email: 'priya@priyaspa.com',
    phone: '+94 77 123 4567',
    company: 'Serenity Spa Chain',
    type: 'Distributor',
    message: 'We are expanding to Colombo and would like to obtain wholesale price catalogs for the Cosmalac Glow Cream range.',
    status: 'New',
    notes: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inq_1',
    name: 'Sanjeewa Silva',
    email: 'sanjeewa@gmail.com',
    phone: '+94 71 987 6543',
    company: '',
    type: 'General',
    message: 'Can I apply the Glow Cream along with vitamin C serums? Please advise if any conflicts occur.',
    status: 'Resolved',
    notes: 'Advised client via email to patch test first and apply Vitamin C in morning, Glow Cream in evening.',
    createdAt: new Date().toISOString()
  }
];

export const InquiryManager = () => {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [noteText, setNoteText] = useState('');
  const [statusVal, setStatusVal] = useState<'New' | 'In Progress' | 'Resolved'>('New');

  // Fetch Inquiries
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries-list'],
    queryFn: async () => {
      const res = await axiosInstance.get('/inquiries');
      return res.data;
    },
    retry: false,
    initialData: MOCK_INQUIRIES
  });

  // Update Inquiry Status Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      return await axiosInstance.put(`/inquiries/${id}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-list'] });
      setSelectedInquiry(null);
    }
  });

  const handleRowClick = (inq: any) => {
    setSelectedInquiry(inq);
    setNoteText(inq.notes || '');
    setStatusVal(inq.status || 'New');
  };

  const handleSave = () => {
    if (!selectedInquiry) return;
    updateMutation.mutate({
      id: selectedInquiry.id || selectedInquiry._id,
      status: statusVal,
      notes: noteText
    });
  };

  return (
    <div class="space-y-6 font-body text-left">
      <div>
        <h1 class="text-2xl font-bold font-heading text-text-primary">Contact & Distributor Leads</h1>
        <p class="text-xs text-text-secondary font-body">Review submitted contact forms and B2B distributor applications.</p>
      </div>

      {/* Inquiry List Table */}
      {isLoading ? (
        <div class="text-xs text-text-secondary">Loading leads...</div>
      ) : (
        <div class="bg-white border border-border-pink rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead>
                <tr class="bg-bg-secondary border-b border-border-pink text-text-primary uppercase tracking-wider font-bold">
                  <th class="p-4">Date</th>
                  <th class="p-4">Sender</th>
                  <th class="p-4">Type</th>
                  <th class="p-4">Company</th>
                  <th class="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-pink/40">
                {inquiries.map((inq: any) => (
                  <tr
                    key={inq.id || inq._id}
                    onClick={() => handleRowClick(inq)}
                    class="hover:bg-bg-primary/20 cursor-pointer transition-colors"
                  >
                    <td class="p-4 text-text-secondary">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td class="p-4">
                      <p class="font-semibold text-text-primary">{inq.name}</p>
                      <p class="text-[10px] text-text-secondary">{inq.email}</p>
                    </td>
                    <td class="p-4">
                      {inq.type === 'Distributor' ? (
                        <span class="px-2 py-0.5 bg-rose-gold text-white font-bold uppercase rounded text-[9px] inline-flex items-center gap-0.5">
                          <Award size={8} /> B2B Trade
                        </span>
                      ) : (
                        <span class="px-2 py-0.5 bg-bg-secondary border border-border-pink text-text-secondary font-bold uppercase rounded text-[9px]">
                          B2C Client
                        </span>
                      )}
                    </td>
                    <td class="p-4 text-text-secondary italic">{inq.company || '—'}</td>
                    <td class="p-4 text-center">
                      {inq.status === 'New' && (
                        <span class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded-full font-bold uppercase text-[9px]">
                          New
                        </span>
                      )}
                      {inq.status === 'In Progress' && (
                        <span class="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-full font-bold uppercase text-[9px]">
                          In Progress
                        </span>
                      )}
                      {inq.status === 'Resolved' && (
                        <span class="px-2 py-0.5 bg-green-50 border border-green-200 text-green-600 rounded-full font-bold uppercase text-[9px]">
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div class="fixed inset-0 bg-[#2D2D2D]/35 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)} />
          
          <div class="bg-white border border-border-pink rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedInquiry(null)}
              class="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div class="space-y-1.5 pb-3 border-b border-border-pink/40">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-rose-gold">Inquiry Details</span>
                <span class="text-[10px] text-text-secondary">| Received: {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
              <h2 class="text-xl font-bold font-heading text-text-primary">{selectedInquiry.name}</h2>
              <p class="text-xs text-text-secondary">{selectedInquiry.email} • {selectedInquiry.phone}</p>
            </div>

            {/* Message Body */}
            <div class="space-y-1 bg-bg-primary/20 p-4 rounded-xl border border-border-pink/30 text-xs">
              <span class="block text-[9px] uppercase font-bold text-muted mb-0.5">Submitted Message</span>
              <p class="text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
            </div>

            {/* Admin Audit & Status editor */}
            <div class="space-y-4 pt-2">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as any)}
                    class="w-full text-xs px-3 py-2 border border-border-pink rounded-xl bg-white focus:outline-none focus:border-rose-gold font-semibold"
                  >
                    <option value="New">New Lead</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Sender Type</label>
                  <div class="py-2 px-3 bg-bg-secondary border border-border-pink/60 rounded-xl text-xs font-semibold text-text-primary text-center uppercase tracking-wide">
                    {selectedInquiry.type}
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Private Trade Notes</label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record call logs, sample dispatches, or catalog agreements..."
                  class="w-full px-4 py-2 border border-border-pink rounded-xl text-xs focus:outline-none focus:border-rose-gold bg-bg-primary/20 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-border-pink/40">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                class="px-5 py-2 bg-bg-secondary text-text-secondary text-xs rounded-full hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                class="px-6 py-2 bg-text-primary text-bg-primary text-xs font-bold uppercase rounded-full hover:bg-rose-gold disabled:bg-muted transition-colors flex items-center gap-1.5"
              >
                {updateMutation.isPending ? <Loader2 size={12} class="animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManager;
