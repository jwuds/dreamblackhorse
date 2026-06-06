import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MediaLibrary = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Media Library</h2>
          <p className="text-gray-400">Manage all images and videos across your website.</p>
        </div>
        <Button onClick={() => handleAction('Upload Media')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Upload className="w-4 h-4 mr-2" /> Upload Files
        </Button>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl luxury-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">All</Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl"><ImageIcon className="w-4 h-4" /></Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl"><Video className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="group relative aspect-square rounded-xl overflow-hidden bg-[#111] border border-white/5 cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-1686858503532-bb58bb0ae680?auto=format&fit=crop&q=80&w=400&h=400&sat=-100`} 
                alt="Media thumbnail" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => handleAction('View Image')} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleAction('Delete Image')} className="p-2 bg-red-500/50 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MediaLibrary;