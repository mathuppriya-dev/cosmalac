import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import axiosInstance from '../../lib/axios';

const MOCK_BLOGS = [
  {
    id: 'blog_0',
    title: 'The Science Behind Niacinamide and Alpha Arbutin',
    slug: 'science-behind-niacinamide-and-alpha-arbutin',
    excerpt: 'Discover why combining Vitamin B3 (Niacinamide) and Alpha Arbutin is the gold standard for clinical skin brightening and hyperpigmentation control.',
    content: 'HTML Content',
    author: 'Dr. Evelyn Carter, R&D Director',
    bannerImage: '/images/scientific_skincare_lab.png',
    tags: ['Science', 'Ingredients', 'Brightening'],
    publishedAt: new Date().toISOString()
  }
];

export const BlogManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<any | null>(null);

  // Form fields
  const [form, setForm] = useState({
    title: '',
    author: 'Cosmalac R&D Team',
    excerpt: '',
    content: '',
    bannerImage: '/images/blog-placeholder.jpg',
    tags: '',
    isFeatured: false
  });

  // Query blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs-list'],
    queryFn: async () => {
      const res = await axiosInstance.get('/blogs');
      return res.data;
    },
    retry: false,
    initialData: MOCK_BLOGS
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editBlog) {
        return await axiosInstance.put(`/blogs/${editBlog.id || editBlog._id}`, payload);
      } else {
        return await axiosInstance.post('/blogs', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs-list'] });
      closeModal();
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosInstance.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs-list'] });
    }
  });

  const handleEditClick = (b: any) => {
    setEditBlog(b);
    setForm({
      title: b.title || '',
      author: b.author || 'Cosmalac R&D Team',
      excerpt: b.excerpt || '',
      content: b.content || '',
      bannerImage: b.bannerImage || '/images/blog-placeholder.jpg',
      tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags || '',
      isFeatured: !!b.isFeatured
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this publication?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditBlog(null);
    setForm({
      title: '',
      author: 'Cosmalac R&D Team',
      excerpt: '',
      content: '',
      bannerImage: '/images/blog-placeholder.jpg',
      tags: '',
      isFeatured: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean)
    };
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 font-body text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Science Blog</h1>
          <p className="text-xs text-text-secondary font-body">Publish scientific articles, R&D breakthroughs, and skin health routine guides.</p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} /> New Publication
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-xs text-text-secondary">Loading...</div>
      ) : (
        <div className="bg-white border border-border-pink rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-pink text-text-primary uppercase tracking-wider font-bold">
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-pink/40">
                {blogs.map((b: any) => (
                  <tr key={b.id || b._id} className="hover:bg-bg-primary/10">
                    <td className="p-4 font-semibold text-text-primary">{b.title}</td>
                    <td className="p-4 text-text-secondary">{b.author}</td>
                    <td className="p-4 text-center">
                      {b.isFeatured ? <Check className="text-rose-gold mx-auto" size={16} /> : <X className="text-muted mx-auto" size={14} />}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <button onClick={() => handleEditClick(b)} className="p-1.5 text-text-secondary hover:text-rose-gold" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDeleteClick(b.id || b._id)} className="p-1.5 text-text-secondary hover:text-red-600" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-[#2D2D2D]/35 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="bg-white border border-border-pink rounded-3xl p-6 md:p-8 max-w-2xl w-full relative z-10 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary">
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              {editBlog ? 'Edit Scientific Publication' : 'Draft New Publication'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Author / Chemist *</label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Short Excerpt / Summary *</label>
                <input
                  type="text"
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    required
                    value={form.bannerImage}
                    onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Science, Brightening, SPF"
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Article Content (Rich HTML supported) *</label>
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="<p>Use HTML paragraphs, headings like <h3>, and list items...</p>"
                  className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20 resize-none font-mono"
                />
              </div>

              <div className="py-2 border-t border-b border-border-pink/40">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase text-text-secondary">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-rose-gold w-4 h-4"
                  />
                  Featured Article (Hero showcase position)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-bg-secondary text-text-secondary rounded-full hover:text-text-primary transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 bg-text-primary text-bg-primary font-bold uppercase rounded-full hover:bg-rose-gold disabled:bg-muted transition-colors flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
