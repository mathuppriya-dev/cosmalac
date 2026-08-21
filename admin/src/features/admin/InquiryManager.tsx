import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  X,
  Award,
  Loader2,
  Trash2
} from 'lucide-react';
import axiosInstance from '../../lib/axios';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Converted', 'Rejected'] as const;

export const InquiryManager = () => {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [noteText, setNoteText] = useState('');
  const [statusVal, setStatusVal] = useState<string>('New');

  // Fetch Inquiries
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries-list'],
    queryFn: async () => {
      const res = await axiosInstance.get('/inquiries');
      return res.data;
    }
  });

  // Update Status Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      return await axiosInstance.put(`/inquiries/${id}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      setSelectedInquiry(null);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosInstance.delete(`/inquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-list'] });
      setSelectedInquiry(null);
    }
  });

  const handleRowClick = (inq: any) => {
    setSelectedInquiry(inq);
    setStatusVal(inq.status || 'New');
    setNoteText(inq.notes || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    updateMutation.mutate({
      id: selectedInquiry.id || selectedInquiry._id,
      status: statusVal,
      notes: noteText
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead record?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredInquiries = inquiries.filter((inq: any) => {
    if (statusFilter === 'ALL') return true;
    return (inq.status || 'New') === statusFilter;
  });

  return (
    <div className="space-y-6 font-body text-left">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#121110]">
            B2B Trade Inquiries & Leads
          </h1>
          <p className="text-xs text-[#57534E] font-medium mt-1">
            Manage wholesale applications, spa & clinic leads, and customer inquiries with status workflows.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#D8D2C8] shadow-xs self-start sm:self-auto overflow-x-auto">
          {['ALL', 'New', 'Contacted', 'Qualified', 'Converted', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-[#121110] text-white'
                  : 'text-[#57534E] hover:text-[#121110]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry List Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#57534E] bg-white rounded-3xl border border-[#D8D2C8]">
          <Loader2 size={24} className="animate-spin text-rose-gold mx-auto mb-2" />
          Loading leads and trade applications...
        </div>
      ) : (
        <div className="bg-white border border-[#D8D2C8] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#EBE7DC]/50 border-b border-[#D8D2C8] text-[#121110] uppercase tracking-wider font-bold">
                  <th className="p-4">Date</th>
                  <th className="p-4">Contact / Company</th>
                  <th className="p-4">Lead Type</th>
                  <th className="p-4">Expected Volume</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2C8]/60">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-[#57534E] font-medium">
                      No inquiries match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq: any) => (
                    <tr
                      key={inq.id || inq._id}
                      onClick={() => handleRowClick(inq)}
                      className="hover:bg-[#F1EFE7]/50 cursor-pointer transition-colors"
                    >
                      <td className="p-4 text-[#57534E] font-medium">
                        {new Date(inq.createdAt || inq.date || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[#121110] text-sm">{inq.name}</p>
                        <p className="text-[11px] text-[#57534E] font-medium">
                          {inq.company ? `${inq.company} • ` : ''}{inq.email}
                        </p>
                      </td>
                      <td className="p-4">
                        {inq.type === 'Distributor' || inq.type === 'B2B Trade' ? (
                          <span className="px-2.5 py-1 bg-rose-gold text-white font-bold uppercase rounded-lg text-[10px] inline-flex items-center gap-1 shadow-2xs">
                            <Award size={10} /> {inq.businessType || 'B2B Trade'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#F1EFE7] border border-[#D8D2C8] text-[#121110] font-bold uppercase rounded-lg text-[10px]">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-[#121110] font-bold">
                        {inq.expectedVolume || 'Standard'}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider inline-block ${
                            inq.status === 'New'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : inq.status === 'Contacted'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : inq.status === 'Qualified'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : inq.status === 'Converted'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {inq.status || 'New'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(inq);
                          }}
                          className="px-3.5 py-1.5 bg-[#121110] text-white rounded-xl text-[11px] font-bold hover:bg-rose-gold transition-colors shadow-2xs"
                        >
                          Inspect Lead
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail & Status Update Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedInquiry(null)}
          />

          <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-2xl space-y-5 text-xs text-left font-body">
            <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-gold">
                Lead Inspection Details
              </span>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-[#57534E] hover:text-[#121110] rounded-lg hover:bg-[#F1EFE7]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold font-heading text-[#121110]">
                  {selectedInquiry.name}
                </h3>
                <p className="text-xs text-[#57534E] font-medium">
                  {selectedInquiry.company ? `${selectedInquiry.company} • ` : ''}
                  {selectedInquiry.email} • {selectedInquiry.phone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-[#F1EFE7]/50 rounded-2xl border border-[#D8D2C8]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#57534E] block">Lead Category</span>
                  <span className="font-bold text-[#121110]">{selectedInquiry.type || 'General'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#57534E] block">Business Model</span>
                  <span className="font-bold text-[#121110]">{selectedInquiry.businessType || 'Direct Retail'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#57534E] block">Expected Volume</span>
                  <span className="font-bold text-[#121110]">{selectedInquiry.expectedVolume || 'Standard Order'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#57534E] block">Country</span>
                  <span className="font-bold text-[#121110]">{selectedInquiry.country || 'Sri Lanka'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#57534E] block mb-1">
                  Message Content:
                </span>
                <div className="p-3.5 bg-[#F1EFE7]/40 border border-[#D8D2C8] rounded-xl text-xs text-[#121110] leading-relaxed font-medium">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleSaveStatus} className="space-y-4 pt-2 border-t border-[#D8D2C8]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Lead Workflow Stage
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-white text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Sent wholesale pricing tier via WhatsApp on Aug 20."
                  className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-white text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry.id || selectedInquiry._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Lead"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-[#121110]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-6 py-2.5 bg-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors shadow-2xs"
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Save Status'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManager;
