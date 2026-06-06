import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AffiliateForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    logo_url: initialData?.logo_url || '',
    link: initialData?.link || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    order: initialData?.order || 0
  });
  
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    // Basic validation
    if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml|webp)/)) {
      alert('Only PNG, JPG, SVG, and WebP images are allowed.');
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `affiliate_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `affiliates/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('horse-images') // Using existing bucket
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('horse-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-full max-w-2xl mx-auto shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          {initialData ? 'Edit Affiliate' : 'Add New Affiliate'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              placeholder="e.g. Royal Friesian Registry"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Logo Image <span className="text-red-500">*</span></label>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragActive ? 'border-white/50 bg-white/5' : 'border-white/10 bg-[#111] hover:border-white/30'}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileSelect} 
                className="hidden" 
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
              />
              
              {uploading ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                  <p className="text-sm text-gray-400">Uploading...</p>
                </div>
              ) : formData.logo_url ? (
                <div className="relative group flex items-center justify-center h-32">
                  <img src={formData.logo_url} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <span className="text-white text-sm">Click or drag to change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-300">Drag & drop logo here</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG, WebP</p>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <label className="text-xs text-gray-500 mb-1 block">Or enter image URL directly:</label>
              <input
                type="url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                required
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Website Link</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30 appearance-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30 resize-none"
              placeholder="Brief description of the affiliation..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onCancel} className="border-white/20 text-gray-300 hover:text-white">
            Cancel
          </Button>
          <Button type="submit" disabled={uploading} className="bg-white text-black hover:bg-gray-200">
            <Save size={18} className="mr-2" />
            {initialData ? 'Update Affiliate' : 'Save Affiliate'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AffiliateForm;