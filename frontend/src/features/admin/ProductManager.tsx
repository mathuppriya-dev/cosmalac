import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  UploadCloud
} from 'lucide-react';
import axiosInstance from '../../lib/axios';

export const ProductManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form Fields
  const [form, setForm] = useState({
    title: '',
    category: 'Creams',
    size: '20g | 0.7 oz',
    status: 'active' as 'active' | 'draft' | 'archived',
    imageUrl: '',
    shortDescription: '',
    description: '',
    benefits: '',
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
      const res = await axiosInstance.get('/products?isAdmin=true');
      return res.data;
    }
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
      queryClient.invalidateQueries({ queryKey: ['products-list'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
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
      queryClient.invalidateQueries({ queryKey: ['products-list'] });
    }
  });

  // Direct Image Upload Handler (JPG/PNG Only, Max 5MB)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      setUploadError('Only JPG, JPEG, and PNG images are permitted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit.');
      return;
    }

    setUploadLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axiosInstance.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEditClick = (p: any) => {
    setEditProduct(p);
    setForm({
      title: p.title || '',
      category: p.category || 'Creams',
      size: p.size || '',
      status: p.status || 'active',
      imageUrl: p.images && p.images.length > 0 ? p.images[0] : '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits || '',
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
    if (confirm('Are you sure you want to delete this formulation? You can also change status to Archived to hide it.')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setUploadError(null);
    setForm({
      title: '',
      category: 'Creams',
      size: '20g | 0.7 oz',
      status: 'active',
      imageUrl: '',
      shortDescription: '',
      description: '',
      benefits: '',
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
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      benefits: form.benefits.split(',').map((s) => s.trim()).filter(Boolean),
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    };
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 font-body text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#121110]">
            Skincare Formulations Catalog
          </h1>
          <p className="text-xs text-[#57534E] font-medium mt-1">
            Add, update, or archive Cosmalac formulations with custom ingredients, benefits, and photography.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-[#121110] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus size={14} /> Add Formulation
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#57534E] bg-white rounded-3xl border border-[#D8D2C8]">
          <Loader2 size={24} className="animate-spin text-rose-gold mx-auto mb-2" />
          Loading products...
        </div>
      ) : (
        <div className="bg-white border border-[#D8D2C8] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#EBE7DC]/50 border-b border-[#D8D2C8] text-[#121110] uppercase tracking-wider font-bold">
                  <th className="p-4">Product Formulation</th>
                  <th className="p-4">Category / Size</th>
                  <th className="p-4 text-center">Catalog Status</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Bestseller</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2C8]/60">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-[#57534E] font-medium">
                      No products found. Click "Add Formulation" above to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((p: any) => (
                    <tr key={p.id || p._id} className="hover:bg-[#F1EFE7]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || '/images/crown_whitening_cream.jpg'}
                            alt={p.title}
                            className="w-12 h-12 object-contain rounded-xl border border-[#D8D2C8] bg-[#F1EFE7] p-1 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/crown_whitening_cream.jpg';
                            }}
                          />
                          <div>
                            <div className="font-bold text-[#121110] text-sm">{p.title}</div>
                            <div className="text-[11px] text-[#57534E] font-medium line-clamp-1">
                              {p.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#121110]">{p.category}</span>
                        {p.size && <span className="block text-[11px] text-[#57534E]">{p.size}</span>}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            (p.status || 'active') === 'active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : p.status === 'draft'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-stone-200 text-stone-700 border border-stone-300'
                          }`}
                        >
                          {p.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {p.isFeatured ? <Check className="text-rose-gold mx-auto" size={16} /> : <X className="text-stone-400 mx-auto" size={14} />}
                      </td>
                      <td className="p-4 text-center">
                        {p.isBestseller ? <Check className="text-accent-gold mx-auto" size={16} /> : <X className="text-stone-400 mx-auto" size={14} />}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 text-[#121110] hover:text-rose-gold rounded-xl hover:bg-[#F1EFE7] transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p.id || p._id)}
                            className="p-2 text-stone-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal with File Upload */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={closeModal} />

          <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 max-w-3xl w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 text-[#57534E] hover:text-[#121110] rounded-full hover:bg-bg-secondary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold font-heading text-[#121110]">
                {editProduct ? 'Edit Formulation Details' : 'Add New Skincare Formulation'}
              </h2>
              <p className="text-xs text-[#57534E] font-medium">
                Upload photography (.jpg, .png), assign status, ingredients, and packaging.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-body text-left">
              {/* Row 1: Title, Category, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crown Whitening Beauty Cream"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creams, Night Cream"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold"
                  >
                    <option value="active">Active (Visible on public catalog)</option>
                    <option value="draft">Draft (Admin review only)</option>
                    <option value="archived">Archived (Hidden from catalog)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Size & Image Upload with Live Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Net Wt. / Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20g | 0.7 oz"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Product Image (URL or Upload .jpg/.png)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <input
                      type="text"
                      placeholder="e.g. /images/crown_whitening_cream.jpg or /uploads/..."
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLoading}
                      className="px-3.5 py-2.5 bg-[#121110] text-white rounded-xl text-xs font-bold hover:bg-rose-gold transition-colors shrink-0 inline-flex items-center gap-1.5"
                      title="Upload JPG/PNG"
                    >
                      {uploadLoading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                      <span>Upload</span>
                    </button>

                    {form.imageUrl && (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-10 h-10 object-contain rounded-xl border border-[#D8D2C8] bg-[#F1EFE7] p-1 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  {uploadError && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{uploadError}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Short Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Card Summary Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summary shown on product cards"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                />
              </div>

              {/* Row 4: Full Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                  Full Formulation Statement *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comprehensive description of product texture, history, and formulation"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                />
              </div>

              {/* Row 5: Benefits & Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Key Targeted Benefits (comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Acne Spots, Wrinkles, Dark Spots, Under-Eye Darkness"
                    value={form.benefits}
                    onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Key Active Ingredients (comma-separated) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Alpha Arbutin, Licorice, Kojic Acid, Vitamin B3, Collagen"
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold resize-none"
                  />
                </div>
              </div>

              {/* Row 6: Directions & Warnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Directions for Use *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apply evenly to clean skin every night before bed."
                    value={form.directions}
                    onChange={(e) => setForm({ ...form, directions: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#121110] mb-1">
                    Caution / Advisory
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. For external use only. Avoid contact with eyes."
                    value={form.warnings}
                    onChange={(e) => setForm({ ...form, warnings: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D8D2C8] rounded-xl bg-[#F1EFE7]/50 text-xs text-[#121110] font-medium focus:outline-none focus:border-rose-gold"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 py-3 border-t border-b border-[#D8D2C8]/60">
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs text-[#121110]">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-rose-gold w-4 h-4"
                  />
                  Featured Skincare
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs text-[#121110]">
                  <input
                    type="checkbox"
                    checked={form.isBestseller}
                    onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                    className="accent-rose-gold w-4 h-4"
                  />
                  Bestseller Formulation
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-[#EBE7DC] text-[#57534E] font-bold uppercase tracking-wider rounded-full hover:text-[#121110] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-7 py-2.5 bg-[#121110] text-white font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors flex items-center gap-2 shadow-xs"
                >
                  {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Save Formulation'}
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
