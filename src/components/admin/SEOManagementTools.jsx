import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Save, Settings, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SEOAuditDashboard from './SEOAuditDashboard';

const SEOManagementTools = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('audit');

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">SEO Management</h2>
          <p className="text-gray-400">Optimize your site for search engines and monitor performance.</p>
        </div>
        <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-px">
        <button 
          onClick={() => setActiveTab('audit')} 
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'audit' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <span className="flex items-center gap-2"><Activity className="w-4 h-4"/> Audit Dashboard</span>
          {activeTab === 'audit' && <motion.div layoutId="seoTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
        </button>
        <button 
          onClick={() => setActiveTab('editor')} 
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'editor' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <span className="flex items-center gap-2"><Settings className="w-4 h-4"/> Page Editor</span>
          {activeTab === 'editor' && <motion.div layoutId="seoTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
        </button>
      </div>

      {activeTab === 'audit' ? (
        <SEOAuditDashboard />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 bg-[#222] rounded-xl border border-white/5 p-4 space-y-2">
            <h4 className="text-white font-medium mb-4">Pages</h4>
            {['Home', 'Horses for Sale', 'About Us', 'Contact', 'Blog'].map((page, idx) => (
              <button key={page} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${idx === 0 ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                {page}
              </button>
            ))}
          </div>
          <div className="md:col-span-3 bg-[#222] rounded-xl border border-white/5 p-6 space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Editing: Home Page SEO</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Title <span className="text-gray-600 text-xs">(Recommended: 50-60 chars)</span></label>
                <input type="text" defaultValue="Premium Friesian Horses for Sale | Dream Black Horse Farm" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description <span className="text-gray-600 text-xs">(Recommended: 150-160 chars)</span></label>
                <textarea rows="3" defaultValue="Discover world-class Friesian horses for sale at Dream Black Horse Farm. Browse our exclusive collection of stallions, mares, and geldings." className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30 transition-colors resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Keywords</label>
                <input type="text" defaultValue="Friesian horses, horses for sale, black horses, premium breeders" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30 transition-colors" />
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-white font-medium mb-4">Social Sharing (Open Graph)</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">OG Image URL</label>
                  <input type="text" defaultValue="https://dreamblackhorse.com/og-home.jpg" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-white/30 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SEOManagementTools;