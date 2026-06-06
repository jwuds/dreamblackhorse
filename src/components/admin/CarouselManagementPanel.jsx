import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCarouselImages } from '@/hooks/useCarouselImages';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';

const CarouselManagementPanel = () => {
  const { images, loading, error: fetchError, fetchImages, addImage, updateImage, deleteImage } = useCarouselImages();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    order: 0
  });

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingImage(item);
      setFormData({
        image_url: item.image_url || '',
        alt_text: item.alt_text || '',
        order: item.order || 0
      });
    } else {
      setEditingImage(null);
      setFormData({ image_url: '', alt_text: '', order: images.length });
    }
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      console.log('CarouselAdmin: Starting file upload to carousel-images bucket...');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('carousel-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('CarouselAdmin: Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('CarouselAdmin: File uploaded successfully, fetching public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from('carousel-images')
        .getPublicUrl(filePath);

      console.log('CarouselAdmin: Generated Public URL:', publicUrl);
      
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Upload Success", description: "Image uploaded to storage successfully." });
      
    } catch (error) {
      console.error("CarouselAdmin: Upload failed:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Could not upload image to storage bucket.", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast({ title: "Validation Error", description: "Image URL is required.", variant: "destructive" });
      return;
    }

    try {
      console.log('CarouselAdmin: Saving data to database:', formData);
      if (editingImage) {
        await updateImage(editingImage.id, formData);
        toast({ title: "Success", description: "Image record updated successfully." });
      } else {
        await addImage(formData);
        toast({ title: "Success", description: "Image record added to carousel." });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("CarouselAdmin: Save failed:", error);
      toast({ title: "Database Error", description: "Failed to save image record.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this image from the carousel?")) return;
    setIsDeleting(id);
    try {
      console.log('CarouselAdmin: Deleting database record id:', id);
      await deleteImage(id);
      toast({ title: "Success", description: "Image removed successfully." });
    } catch (error) {
      console.error("CarouselAdmin: Delete failed:", error);
      toast({ title: "Error", description: "Failed to delete image record.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white">Carousel Images</h2>
          <p className="text-gray-400 text-sm mt-1">Manage images displayed in the main Welcome carousel.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-white text-black hover:bg-gray-200">
          <Plus size={18} className="mr-2" /> Add Image
        </Button>
      </div>

      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 flex items-center justify-between">
          <p>Error loading images: {fetchError}</p>
          <Button variant="ghost" size="sm" onClick={fetchImages}>Retry</Button>
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-lg p-6">
        {loading && images.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16 gap-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <span className="text-gray-400">Loading carousel data...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center text-gray-500 py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">No carousel images found.</p>
            <p className="text-sm mt-1">Click "Add Image" to upload your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <div key={item.id} className="bg-[#111] rounded-xl border border-white/10 overflow-hidden group hover:border-white/30 transition-colors">
                <div className="aspect-video relative overflow-hidden bg-black/50">
                  <img 
                    src={item.image_url} 
                    alt={item.alt_text || 'Carousel image'} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ccm9rZW4gSW1hZ2UgTGluazwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button size="icon" variant="secondary" onClick={() => handleOpenForm(item)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)} disabled={isDeleting === item.id}>
                      {isDeleting === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-300 truncate font-medium" title={item.alt_text}>Alt: {item.alt_text || 'None'}</p>
                  <p className="text-xs text-gray-500 font-mono flex justify-between items-center">
                    <span>Order: {item.order}</span>
                    <a href={item.image_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate ml-4 max-w-[120px]">View URL</a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl relative my-auto">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{editingImage ? 'Edit Carousel Image' : 'Add Carousel Image'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-3 bg-[#111] p-4 rounded-xl border border-white/5">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <UploadCloud size={16} /> Upload New Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 disabled:opacity-50"
                />
                {isUploading && <p className="text-xs text-blue-400 flex items-center mt-2"><Loader2 size={12} className="animate-spin mr-1" /> Uploading to storage...</p>}
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">OR</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Image URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">Paste a direct image link or use the upload button above.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-300">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition-colors"
                    placeholder="Description for accessibility"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition-colors"
                  />
                </div>
              </div>

              {formData.image_url && (
                <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10 relative bg-[#0a0a0a]">
                   <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMWEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbnZhbGlkIEltYWdlIFVSTDwvdGV4dD48L3N2Zz4=";
                      }} 
                    />
                   <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-gray-300 font-mono backdrop-blur-md">Preview</div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={isUploading || !formData.image_url} className="bg-white text-black hover:bg-gray-200 px-8">Save Record</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CarouselManagementPanel;