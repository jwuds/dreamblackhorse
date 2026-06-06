import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import HeroImageUpload from './HeroImageUpload';

const HeroImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error fetching images",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setImages(images.map(img => img.id === id ? { ...img, status: newStatus } : img));
      toast({ title: "Status Updated", description: "Image status changed successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleDelete = async (id, url) => {
    if (!window.confirm('Are you sure you want to delete this hero image?')) return;
    try {
      // Delete from DB
      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);
      if (dbError) throw dbError;

      // Extract path to delete from storage if it matches site-images
      if (url && url.includes('site-images')) {
        const pathMatch = url.match(/site-images\/(.*)/);
        if (pathMatch && pathMatch[1]) {
           await supabase.storage.from('site-images').remove([pathMatch[1]]);
        }
      }

      setImages(images.filter(img => img.id !== id));
      toast({ title: "Deleted", description: "Hero image removed." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const moveImage = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) return;

    const newImages = [...images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order values
    const tempOrder = newImages[index].order;
    newImages[index].order = newImages[swapIndex].order;
    newImages[swapIndex].order = tempOrder;

    // Swap positions in array
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);

    try {
      // Bulk update using Promise.all
      await Promise.all([
        supabase.from('hero_images').update({ order: newImages[index].order }).eq('id', newImages[index].id),
        supabase.from('hero_images').update({ order: newImages[swapIndex].order }).eq('id', newImages[swapIndex].id)
      ]);
    } catch (err) {
      toast({ variant: "destructive", title: "Update Error", description: "Failed to save new order." });
      fetchImages(); // revert on fail
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Hero Images</h2>
        <p className="text-gray-400">Manage the sliding carousel images displayed on the home page.</p>
      </div>

      <HeroImageUpload onUploadSuccess={fetchImages} />

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No hero images found. Upload some to get started.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {images.map((img, idx) => (
              <div key={img.id} className={`p-4 flex items-center justify-between gap-4 transition-colors ${img.status === 'inactive' ? 'opacity-50' : ''} hover:bg-[#222]`}>
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-30"><ArrowUp size={16}/></button>
                    <button onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-30"><ArrowDown size={16}/></button>
                  </div>
                  <div className="w-32 h-20 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img src={img.image_url} alt={img.alt_text || 'Hero'} className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-300 font-medium truncate max-w-[200px]">{img.alt_text || 'No Alt Text'}</p>
                    <p className="text-xs text-gray-500">Order: {img.order}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`border-white/20 hover:bg-white/10 ${img.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}
                    onClick={() => handleToggleStatus(img.id, img.status)}
                  >
                    {img.status === 'active' ? <><Eye size={16} className="mr-2"/> Active</> : <><EyeOff size={16} className="mr-2"/> Inactive</>}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => handleDelete(img.id, img.image_url)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImageManager;