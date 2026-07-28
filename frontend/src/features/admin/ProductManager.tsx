import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Check, X, ShieldAlert, Loader2 } from 'lucide-react';
import axiosInstance from '../../lib/axios';

const MOCK_PRODUCTS = [
  {
    id: 'prod_0',
    title: 'Cosmalac Glow Cream',
    slug: 'cosmalac-glow-cream',
    shortDescription: 'Advanced brightening cream with Niacinamide and Alpha Arbutin for a glowing, even skin tone.',
    description: 'Daily clinical cream designed for melanogenesis blocking.',
    category: 'Creams',
    ingredients: ['Niacinamide', 'Alpha Arbutin'],
    directions: 'Apply twice daily.',
    images: ['/images/glow_cream_jar.png'],
    isFeatured: true,
    isBestseller: true
  },
  {
    id: 'prod_1',
    title: 'Cosmalac Hydrating Serum',
    slug: 'cosmalac-hydrating-serum',
    shortDescription: 'Multi-weight Hyaluronic Acid serum infused with Vitamin C.',
    description: 'Triple molecule deep humectant hydration.',
    category: 'Serums',
    ingredients: ['Hyaluronic Acid', 'Vitamin C'],
    directions: 'Press onto clean skin.',
    images: ['/images/hydrating_serum_dropper.png'],
    isFeatured: true,
    isBestseller: false
  }
];

export const ProductManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  // Form Fields
  const [form, setForm] = useState({
    title: '',
    category: 'Creams',
    shortDescription: '',
    description: '',
    ingredients: '',
    directions: '',
    warnings: '',
    storage: '',
    packaging: '',
    isFeatured: false,
    isBestseller: false
  });

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products-list'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products');
      return res.data;
    },
    retry: false,
    initialData: MOCK_PRODUCTS
  });

  // Add/Edit Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editProduct) {
        return await axiosInstance.put(`/products/${editProduct.id || editProduct._id}`, payload);
      } else {
        return await axiosInstance.post('/products', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
      closeModal();
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosInstance.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    }
  });

  const handleEditClick = (p: any) => {
    setEditProduct(p);
    setForm({
      title: p.title || '',
      category: p.category || 'Creams',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(', ') : p.ingredients || '',
      directions: p.directions || '',
      warnings: p.warnings || '',
      storage: p.storage || '',
      packaging: p.packaging || '',
      isFeatured: !!p.isFeatured,
      isBestseller: !!p.isBestseller
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this formulation?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm({
      title: '',
      category: 'Creams',
      shortDescription: '',
      description: '',
      ingredients: '',
      directions: '',
      warnings: '',
      storage: '',
      packaging: '',
      isFeatured: false,
      isBestseller: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    };
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 font-body text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Product Catalog</h1>
          <p className="text-xs text-text-secondary font-body">Add, edit, or remove skin care formulations in the public showcase database.</p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Formulation
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-text-secondary text-xs">Loading items...</div>
      ) : (
        <div className="bg-white border border-border-pink rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-pink text-text-primary uppercase tracking-wider font-bold">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Bestseller</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-pink/40">
                {products.map((p: any) => (
                  <tr key={p.id || p._id} className="hover:bg-bg-primary/10">
                    <td className="p-4 font-semibold text-text-primary">{p.title}</td>
                    <td className="p-4 text-text-secondary">{p.category}</td>
                    <td className="p-4 text-center">
                      {p.isFeatured ? <Check className="text-rose-gold mx-auto" size={16} /> : <X className="text-muted mx-auto" size={14} />}
                    </td>
                    <td className="p-4 text-center">
                      {p.isBestseller ? <Check className="text-rose-gold mx-auto" size={16} /> : <X className="text-muted mx-auto" size={14} />}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <button onClick={() => handleEditClick(p)} className="p-1.5 text-text-secondary hover:text-rose-gold" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDeleteClick(p.id || p._id)} className="p-1.5 text-text-secondary hover:text-red-600" title="Delete">
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

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-[#2D2D2D]/30 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="bg-white border border-border-pink rounded-3xl p-6 md:p-8 max-w-2xl w-full relative z-10 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary">
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              {editProduct ? 'Edit Skincare Formulation' : 'Create Skincare Formulation'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
              {/* Row 1: Title, Category */}
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
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-white"
                  >
                    <option value="Creams">Creams</option>
                    <option value="Serums">Serums</option>
                    <option value="Cleansers">Cleansers</option>
                    <option value="Toners">Toners</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Short Description */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>

              {/* Row 3: Full Description */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Full Formulation Description *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20 resize-none"
                />
              </div>

              {/* Row 4: Ingredients, Directions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Ingredients (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    placeholder="Niacinamide, Alpha Arbutin"
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Directions *</label>
                  <input
                    type="text"
                    required
                    value={form.directions}
                    onChange={(e) => setForm({ ...form, directions: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
              </div>

              {/* Row 5: Warnings, Storage, Packaging */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Warnings</label>
                  <input
                    type="text"
                    value={form.warnings}
                    onChange={(e) => setForm({ ...form, warnings: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Storage</label>
                  <input
                    type="text"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">Packaging</label>
                  <input
                    type="text"
                    value={form.packaging}
                    onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                    className="w-full px-4 py-2 border border-border-pink rounded-xl focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 py-2 border-t border-b border-border-pink/40">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase text-text-secondary">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-rose-gold w-4 h-4"
                  />
                  Featured Skincare
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase text-text-secondary">
                  <input
                    type="checkbox"
                    checked={form.isBestseller}
                    onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                    className="accent-rose-gold w-4 h-4"
                  />
                  Bestseller Item
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-bg-secondary text-text-secondary rounded-full hover:text-text-primary transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 bg-text-primary text-bg-primary font-bold uppercase rounded-full hover:bg-rose-gold disabled:bg-muted transition-colors flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Save Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
