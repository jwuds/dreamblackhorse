import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ContentManagement = () => {
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
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Content Pages</h2>
          <p className="text-gray-400">Edit static page content and blog posts.</p>
        </div>
        <Button onClick={() => handleAction('Save All Changes')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {['Home Page', 'About Us', 'Contact', 'Blog Posts'].map((tab, idx) => (
            <button 
              key={tab}
              onClick={() => handleAction(`Switch to ${tab}`)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${idx === 0 ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <FileText className="w-4 h-4" /> {tab}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl luxury-border">
          <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display']">Editing: Home Page</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hero Headline</label>
              <input 
                type="text" 
                defaultValue="Discover Your Perfect Friesian Horse"
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hero Subtitle</label>
              <textarea 
                rows="3"
                defaultValue="Step into a world of elegance. Explore our carefully curated selection of premium Friesians..."
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-white/5">
              <Button onClick={() => handleAction('Update Home Page')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                Update Page Section
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentManagement;