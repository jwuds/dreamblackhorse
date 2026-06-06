import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AboutImageSelector = ({ onSelect, onClose, targetSection }) => {
  const [libraryImages, setLibraryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const filteredImages = libraryImages.filter(img => 
    (img.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     img.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirm = () => {
    if (selectedId) {
      const img = libraryImages.find(i => i.id === selectedId);
      onSelect(img);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#111]">
          <div>
            <h3 className="text-xl font-bold text-white">Select Image for {targetSection.replace('about_', '')}</h3>
            <p className="text-sm text-gray-400 mt-1">Choose an image from your media library</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-white/10 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by filename or alt text..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#0f0f0f]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No images found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredImages.map(img => (
                <div 
                  key={img.id}
                  onClick={() => setSelectedId(img.id)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    selectedId === img.id ? 'border-[#d4af37]' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="aspect-square bg-[#111]">
                    <img src={img.file_path} alt={img.alt_text} className="w-full h-full object-cover" />
                  </div>
                  {selectedId === img.id && (
                    <div className="absolute top-2 right-2 bg-[#d4af37] text-black rounded-full p-1">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 p-2 backdrop-blur-sm">
                    <p className="text-[10px] text-white truncate">{img.file_name}</p>
                    <p className="text-[9px] text-gray-400">{(img.file_size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-[#111] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedId}
            className="px-5 py-2.5 rounded-lg font-medium bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutImageSelector;