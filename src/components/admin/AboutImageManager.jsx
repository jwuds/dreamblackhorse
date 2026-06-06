import React, { useState } from 'react';
import { useAboutImages } from '@/hooks/useAboutImages';
import { Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import AboutImageSelector from './AboutImageSelector';

const AboutImageManager = () => {
  const { images, loading, error, publishImage } = useAboutImages();
  const [selectorState, setSelectorState] = useState({ isOpen: false, section: null });
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const sections = [
    { id: 'about_story', title: 'Our Story Section', description: 'Main image displayed in the "Our Story" section.' },
    { id: 'about_mission', title: 'Our Mission Section', description: 'Image representing the company mission.' },
    { id: 'about_vision', title: 'Our Vision Section', description: 'Image depicting the vision for the future.' }
  ];

  const handleOpenSelector = (section) => {
    setSelectorState({ isOpen: true, section });
    setMessage({ text: '', type: '' });
  };

  const handleSelectImage = async (selectedImage) => {
    const targetSection = selectorState.section;
    setSelectorState({ isOpen: false, section: null });
    
    if (!selectedImage) return;

    setUpdating(targetSection);
    try {
      await publishImage(selectedImage.id, targetSection);
      setMessage({ text: `Successfully updated image for ${targetSection.replace('about_', '')}`, type: 'success' });
    } catch (err) {
      setMessage({ text: `Failed to update: ${err.message}`, type: 'error' });
    } finally {
      setUpdating(null);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  if (loading && !images.about_story) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">About Page Images</h2>
        <p className="text-gray-400 text-sm">Manage the primary images displayed on the public About Us page.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const currentImg = images[section.id];
          const isUpdating = updating === section.id;

          return (
            <div key={section.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white capitalize">{section.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{section.description}</p>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="aspect-[4/3] bg-[#111] rounded-xl mb-4 relative overflow-hidden border border-white/5 group">
                  {currentImg ? (
                    <img 
                      src={currentImg.file_path} 
                      alt={currentImg.alt_text || section.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-xs font-medium">No Image Set</span>
                    </div>
                  )}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  {currentImg?.isFallback && !isUpdating && (
                    <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-1 rounded">
                      Fallback
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  {currentImg && !currentImg.isFallback && (
                    <div className="text-xs text-gray-400 bg-black/30 p-3 rounded-lg border border-white/5">
                      <div className="flex justify-between mb-1">
                        <span>Status:</span>
                        <span className="text-green-400 font-medium">Published</span>
                      </div>
                      <div className="flex justify-between truncate">
                        <span className="mr-2">File:</span>
                        <span className="truncate text-white" title={currentImg.file_name}>{currentImg.file_name || 'Unknown'}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenSelector(section.id)}
                    disabled={isUpdating}
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ImageIcon size={16} />
                    {currentImg?.isFallback || !currentImg ? 'Select Image' : 'Replace Image'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectorState.isOpen && (
        <AboutImageSelector 
          targetSection={selectorState.section}
          onClose={() => setSelectorState({ isOpen: false, section: null })}
          onSelect={handleSelectImage}
        />
      )}
    </div>
  );
};

export default AboutImageManager;