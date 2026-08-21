import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UploadCloud,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '../../lib/axios';

export const MediaManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch Media Assets
  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['admin-media-list'],
    queryFn: async () => {
      const res = await axiosInstance.get('/media');
      return res.data;
    }
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExtensions.includes(ext)) {
        throw new Error('Security Restriction: Only .jpg, .jpeg, and .png image files are permitted.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File Size Limit: Images must not exceed 5MB.');
      }

      const formData = new FormData();
      formData.append('image', file);
      const res = await axiosInstance.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      setUploadError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-media-list'] });
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      setUploadError(err.response?.data?.message || err.message || 'Error uploading file.');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosInstance.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media-list'] });
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);
      uploadMutation.mutate(file);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this media asset?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 text-left font-body">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#121110]">
          Media Asset Library
        </h1>
        <p className="text-xs text-[#57534E] font-medium mt-1">
          Upload, manage, and replace product photography and brand imagery. Strict format enforcement: JPG/PNG only (Max 5MB).
        </p>
      </div>

      {/* Upload Zone Card */}
      <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-[#D8D2C8] text-center space-y-4 shadow-xs hover:border-[#D8A7B1] transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload-input"
        />

        <div className="w-14 h-14 rounded-2xl bg-rose-gold/15 text-rose-gold flex items-center justify-center mx-auto shadow-2xs">
          <UploadCloud size={28} />
        </div>

        <div>
          <h3 className="text-base font-bold font-heading text-[#121110]">
            Upload New Media File
          </h3>
          <p className="text-xs text-[#57534E] mt-1">
            Select a high-resolution cosmetic photograph (.jpg, .jpeg, .png).
          </p>
        </div>

        {uploadError && (
          <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="px-6 py-2.5 bg-[#121110] text-[#F1EFE7] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-gold transition-colors inline-flex items-center gap-2 shadow-xs disabled:opacity-50"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Uploading & Validating...
            </>
          ) : (
            <>
              <UploadCloud size={14} /> Choose File
            </>
          )}
        </button>
      </div>

      {/* Media Assets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#121110]">
            Stored Assets ({mediaItems.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#57534E] bg-white rounded-2xl border border-[#D8D2C8]">
            <Loader2 size={24} className="animate-spin text-rose-gold mx-auto mb-2" />
            Loading media assets...
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#57534E] bg-white rounded-2xl border border-[#D8D2C8]">
            No media assets uploaded yet. Use the upload box above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {mediaItems.map((item: any) => (
              <div
                key={item._id || item.id}
                className="bg-white border border-[#D8D2C8] rounded-2xl overflow-hidden shadow-xs group flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="aspect-square bg-[#F1EFE7]/50 p-2 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.originalName || 'Asset'}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#121110]/70 backdrop-blur-xs text-white text-[9px] font-bold rounded uppercase">
                    {item.mimeType?.includes('png') ? 'PNG' : 'JPG'}
                  </span>
                </div>

                {/* Info & Action Controls */}
                <div className="p-3.5 space-y-2 border-t border-[#D8D2C8]/60">
                  <p className="text-xs font-bold text-[#121110] truncate" title={item.originalName || item.filename}>
                    {item.originalName || item.filename}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleCopyUrl(item.url, item._id || item.id)}
                      className="flex-1 py-1.5 px-2 bg-[#F1EFE7] hover:bg-rose-gold hover:text-white rounded-lg text-[11px] font-bold text-[#121110] transition-colors flex items-center justify-center gap-1"
                    >
                      {copiedId === (item._id || item.id) ? (
                        <>
                          <Check size={12} className="text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy URL
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      className="p-1.5 text-[#57534E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
