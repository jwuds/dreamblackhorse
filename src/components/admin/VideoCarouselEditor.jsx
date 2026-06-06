import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateId } from '@/lib/localStorageUtils';

const VideoCarouselEditor = ({ isOpen, onClose, videos, onUpdate }) => {
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');

  const handleAddVideo = () => {
    if (!newUrl || !newTitle) {
      toast({ title: 'Error', description: 'Title and URL are required.', variant: 'destructive' });
      return;
    }
    const newVideo = {
      id: generateId(),
      title: newTitle,
      url: newUrl,
      thumbnail: newThumbnail || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
      display_order: videos.length
    };
    onUpdate([...videos, newVideo]);
    toast({ title: 'Success', description: 'Video added successfully.' });
    setNewUrl(''); setNewTitle(''); setNewThumbnail('');
  };

  const handleDelete = (id) => {
    const updated = videos.filter(v => v.id !== id);
    onUpdate(updated);
    toast({ title: 'Success', description: 'Video deleted.' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">Manage Videos</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="bg-[#111] p-4 rounded-xl border border-white/5 space-y-4">
              <h4 className="font-semibold text-white">Add New Video</h4>
              <input type="text" placeholder="Video Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white" />
              <input type="text" placeholder="Video URL (YouTube, Vimeo, MP4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white" />
              <input type="text" placeholder="Thumbnail Image URL" value={newThumbnail} onChange={e => setNewThumbnail(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white" />
              <Button onClick={handleAddVideo} className="w-full bg-white text-black">
                <UploadCloud className="w-4 h-4 mr-2" /> Add Video
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">Current Videos</h4>
              {videos.map(video => (
                <div key={video.id} className="flex items-center gap-4 bg-[#222] p-3 rounded-lg border border-white/5">
                  <img src={video.thumbnail} alt={video.title} className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{video.title}</p>
                    <p className="text-xs text-gray-500 truncate">{video.url}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 shrink-0" onClick={() => handleDelete(video.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {videos.length === 0 && <p className="text-gray-500 text-sm">No videos added yet.</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VideoCarouselEditor;