import React, { useState, useEffect } from 'react';
import { useExploreFarmImage } from '@/hooks/useExploreFarmImage';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Image as ImageIcon, CheckCircle, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ExploreFarmImageSelector = () => {
  const { image, loading, publishImage } = useExploreFarmImage();
  const [libraryImages, setLibraryImages] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    setLibraryLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLibraryImages(data || []);
    } catch (err) {
      console.error('Error fetching library:', err);
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleSelectImage = async (selectedImage) => {
    setIsUpdating(true);
    try {
      await publishImage(selectedImage.id);
      toast({
        title: 'Image Updated',
        description: 'Explore Farm image has been successfully updated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredImages = libraryImages.filter(img => 
    img.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    img.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Explore Farm Image</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Current Image</h3>
        <div className="aspect-[16/9] max-w-xl bg-[#111] rounded-xl overflow-hidden border border-white/10 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            </div>
          ) : image ? (
            <img src={image.file_path} alt={image.alt_text || "Explore Farm"} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <ImageIcon size={32} className="mb-2" />
              <span>No image selected</span>
            </div>
          )}
          {image?.isFallback && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              Fallback
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Select from Media Library</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search images..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#222] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-white/30"
          />
        </div>

        {libraryLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            {filteredImages.map(img => (
              <div 
                key={img.id}
                onClick={() => handleSelectImage(img)}
                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  image?.id === img.id ? 'border-[#d4af37]' : 'border-transparent hover:border-white/20'
                } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="aspect-[16/9] bg-[#111]">
                  <img src={img.file_path} alt={img.alt_text} className="w-full h-full object-cover" />
                </div>
                {image?.id === img.id && (
                  <div className="absolute top-2 right-2 bg-[#d4af37] text-black rounded-full p-1 z-10">
                    <CheckCircle size={16} />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 p-2 backdrop-blur-sm">
                  <p className="text-[10px] text-white truncate">{img.file_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreFarmImageSelector;