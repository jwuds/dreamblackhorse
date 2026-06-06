import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Image as ImageIcon, Upload } from 'lucide-react';

const ImageSelectorBase = ({ section, title }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', section)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      toast({ title: 'Error fetching images', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${section}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('site_images').insert({
        section: section,
        file_path: publicUrl,
        file_name: file.name,
        status: 'published',
        published_at: new Date().toISOString()
      });

      if (dbError) throw dbError;

      toast({ title: 'Success', description: 'Image uploaded and published successfully.' });
      fetchImages();
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, fileUrl) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      // In a real scenario, you'd also delete from storage bucket.
      const { error } = await supabase.from('site_images').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Image deleted.' });
      fetchImages();
    } catch (err) {
      toast({ title: 'Error deleting', description: err.message, variant: 'destructive' });
    }
  };

  const togglePublish = async (img) => {
    try {
      const newStatus = img.status === 'published' ? 'draft' : 'published';
      const updates = { status: newStatus };
      if (newStatus === 'published') updates.published_at = new Date().toISOString();
      
      const { error } = await supabase.from('site_images').update(updates).eq('id', img.id);
      if (error) throw error;
      
      toast({ title: 'Success', description: `Image ${newStatus}.` });
      fetchImages();
    } catch (err) {
      toast({ title: 'Error updating', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div>
          <input type="file" id={`upload-${section}`} className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          <label htmlFor={`upload-${section}`}>
            <Button as="span" disabled={uploading} className="bg-[#d4af37] text-black hover:bg-[#b5952f] cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload Image
            </Button>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-gray-500 animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-[#111] rounded-xl border border-white/5 border-dashed">
          <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No images uploaded for this section yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map(img => (
            <div key={img.id} className="bg-[#111] rounded-xl border border-white/10 overflow-hidden group">
              <div className="relative aspect-video">
                <img src={img.file_path} alt={img.alt_text || 'Uploaded image'} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${img.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {img.status}
                  </span>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => togglePublish(img)} className="border-white/20 text-white">
                  {img.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(img.id, img.file_path)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSelectorBase;