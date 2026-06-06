import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const SECTIONS = ['hero', 'featured_horses', 'latest_insights', 'about_preview', 'footer', 'other'];

export default function ImageUploadComponent({ onUploadSuccess, onCancel }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    section_name: 'hero',
    image_alt: '',
    display_order: 0,
    is_active: true
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      toast({ title: 'Invalid File', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    
    if (selected.size > 5 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Maximum file size is 5MB.', variant: 'destructive' });
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({ title: 'Missing Image', description: 'Please select an image to upload.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `home-pages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const newRecord = {
        section_name: formData.section_name,
        image_url: publicUrl,
        image_alt: formData.image_alt,
        display_order: parseInt(formData.display_order, 10),
        is_active: formData.is_active
      };

      if (onUploadSuccess) {
        await onUploadSuccess(newRecord);
      }
      
      toast({ title: 'Success', description: 'Image uploaded successfully.' });
      
      // Reset form
      setFile(null);
      setPreview(null);
      setFormData(prev => ({ ...prev, image_alt: '', display_order: 0 }));

    } catch (err) {
      console.error('Upload Error:', err);
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Upload New Image</h3>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image File</label>
          {preview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-black">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              <button 
                type="button" 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#d4af37]/50 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <label className="cursor-pointer">
                <span className="bg-[#d4af37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#b5952f] transition-colors">Select Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              <p className="text-xs text-gray-500 mt-4">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
            <select 
              value={formData.section_name} 
              onChange={e => setFormData(p => ({ ...p, section_name: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            >
              {SECTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
            <input 
              type="number" 
              value={formData.display_order} 
              onChange={e => setFormData(p => ({ ...p, display_order: e.target.value }))}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text</label>
          <input 
            type="text" 
            value={formData.image_alt} 
            onChange={e => setFormData(p => ({ ...p, image_alt: e.target.value }))}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-[#d4af37]"
            placeholder="Description of the image for SEO"
          />
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="is_active"
            checked={formData.is_active}
            onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
            className="w-5 h-5 bg-[#111] border-white/10 rounded text-[#d4af37] focus:ring-[#d4af37]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-300">Active (Visible on site)</label>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6">
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
          {loading ? 'Uploading...' : 'Save Image'}
        </Button>
      </form>
    </div>
  );
}